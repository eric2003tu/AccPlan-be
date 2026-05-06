import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

type BusinessRow = {
  id: string;
  name: string;
};

type AccountRow = {
  id: string;
  code: string | null;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';
};

type JournalLineRow = {
  id: string;
  account_id: string | null;
  debit: unknown;
  credit: unknown;
};

type JournalEntryRow = {
  id: string;
  entry_date: Date | null;
  reference: string | null;
  description: string | null;
  created_at: Date;
  lines: JournalLineRow[];
};

type TotalsRow = {
  debit: number;
  credit: number;
};

type LedgerLineRow = {
  journal_entry_id: string;
  journal_date: string;
  reference: string | null;
  description: string | null;
  debit: number;
  credit: number;
  running_balance: number;
};

type GeneratedReport = {
  type: 'BALANCE_SHEET' | 'INCOME_STATEMENT' | 'TRIAL_BALANCE' | 'LEDGER' | 'CASHBOOK';
  name: string;
  data: unknown;
};

@Injectable()
export class ReportsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ReportsService.name);
  private dailyGenerationTimer?: NodeJS.Timeout;

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const enableDaily = process.env.ENABLE_DAILY_REPORTS !== 'false';

    if (!enableDaily) {
      this.logger.log('Automatic daily report generation is disabled (ENABLE_DAILY_REPORTS=false)');
      return;
    }

    try {
      await this.generateDailyFinancialStatements();
    } catch (error) {
      const message = error instanceof Error ? error.stack ?? error.message : String(error);
      this.logger.error('Initial daily report generation failed', message);
    }

    this.scheduleNextDailyRun();
  }

  onModuleDestroy() {
    if (this.dailyGenerationTimer) {
      clearTimeout(this.dailyGenerationTimer);
    }
  }

  async create(createReportDto: CreateReportDto) {
    const periodStart = createReportDto.period_start ? new Date(createReportDto.period_start) : null;
    const periodEnd = createReportDto.period_end ? new Date(createReportDto.period_end) : null;

    return this.prisma.reports.create({
      data: {
        id: randomUUID(),
        business_id: createReportDto.business_id,
        name: createReportDto.name ?? `${createReportDto.type} Report`,
        type: createReportDto.type,
        period_start: periodStart ?? undefined,
        period_end: periodEnd ?? undefined,
        data: createReportDto.data,
        file_url: createReportDto.file_url,
        status: createReportDto.status ?? 'GENERATED',
        format: createReportDto.format ?? 'JSON',
      },
    });
  }

  async findAll(businessId?: string, skip = 0, take = 10) {
    return this.prisma.reports.findMany({
      where: businessId ? { business_id: businessId } : {},
      orderBy: {
        generated_at: 'desc',
      },
      skip,
      take,
    });
  }

  async findOne(id: string) {
    const report = await this.prisma.reports.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  async update(id: string, updateReportDto: UpdateReportDto) {
    const report = await this.prisma.reports.findUnique({ where: { id } });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return this.prisma.reports.update({
      where: { id },
      data: updateReportDto,
    });
  }

  async remove(id: string) {
    const report = await this.prisma.reports.findUnique({ where: { id } });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return this.prisma.reports.delete({ where: { id } });
  }

  async generateDailyFinancialStatements(asOfDate?: string | Date) {
    const range = this.getDayRange(asOfDate);
    const businesses = await this.prisma.businesses.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    const generatedReports: any[] = [];

    for (const business of businesses) {
      const reports = await this.generateForBusiness(business, range);
      generatedReports.push(...reports);
    }

    return generatedReports;
  }

  private async generateForBusiness(business: BusinessRow, range: { start: Date; end: Date }) {
    // fetch accounts first (smallish) then stream/process journal entries in batches
    const accounts = await this.prisma.accounts.findMany({
      where: { business_id: business.id },
      select: { id: true, code: true, name: true, type: true },
    });

    // Build maps and accumulators up front
    const accountMap = new Map<string, AccountRow>(accounts.map((account: AccountRow) => [account.id, account]));
    const totalsMap = new Map<string, TotalsRow>();
    const ledgerMap = new Map<string, LedgerLineRow[]>();
    const cashbookLines: Array<Record<string, unknown>> = [];

    const batchSize = 500;
    let lastCursorId: string | undefined;

    // Filter: include entries with entry_date between start and end OR (entry_date IS NULL AND created_at between start and end)
    const baseWhere: any = {
      business_id: business.id,
      OR: [
        { entry_date: { gte: range.start, lte: range.end } },
        { AND: [{ entry_date: null }, { created_at: { gte: range.start, lte: range.end } }] },
      ],
    };

    // process journal entries in batches using cursor-based pagination to avoid slow skips
    while (true) {
      const journalEntriesRaw = await this.prisma.journal_entries.findMany({
        where: baseWhere,
        select: { id: true, entry_date: true, reference: true, description: true, created_at: true },
        orderBy: [{ entry_date: 'asc' }, { created_at: 'asc' }, { id: 'asc' }],
        take: batchSize,
        ...(lastCursorId ? { cursor: { id: lastCursorId }, skip: 1 } : {}),
      });

      const entryIds = journalEntriesRaw.map((e) => e.id);
      let journalLines: any[] = [];
      if (entryIds.length > 0) {
        journalLines = await this.prisma.journal_lines.findMany({ where: { journal_id: { in: entryIds } } });
      }

      const journalEntries = journalEntriesRaw.map((e) => ({
        ...e,
        lines: (journalLines.filter((l) => l.journal_id === e.id) as JournalLineRow[]).map((l) => ({
          id: l.id,
          account_id: l.account_id,
          debit: l.debit,
          credit: l.credit,
        })),
      })) as JournalEntryRow[];

      if (!journalEntries || journalEntries.length === 0) break;

      for (const entry of journalEntries) {
        const effectiveDate = (entry.entry_date ?? entry.created_at).toISOString();

        for (const line of entry.lines) {
          const debit = this.toAmount(line.debit);
          const credit = this.toAmount(line.credit);
          const accountId = line.account_id ?? undefined;

          if (accountId) {
            const totals = totalsMap.get(accountId) ?? { debit: 0, credit: 0 };
            totals.debit += debit;
            totals.credit += credit;
            totalsMap.set(accountId, totals);

            const ledgerLines = ledgerMap.get(accountId) ?? [];
            ledgerLines.push({
              journal_entry_id: entry.id,
              journal_date: effectiveDate,
              reference: entry.reference,
              description: entry.description,
              debit,
              credit,
              running_balance: 0,
            });
            ledgerMap.set(accountId, ledgerLines);

            const account = accountMap.get(accountId) as AccountRow | undefined;
            if (this.isCashAccount(account)) {
              cashbookLines.push({
                journal_entry_id: entry.id,
                journal_date: effectiveDate,
                account_id: accountId,
                account_name: account?.name ?? 'Unknown account',
                reference: entry.reference,
                description: entry.description,
                debit,
                credit,
                movement: debit - credit,
              });
            }
          }
        }
      }

      // advance cursor
      lastCursorId = journalEntries[journalEntries.length - 1].id;
      if (journalEntries.length < batchSize) break;
    }

    // journal entries have already been processed in batches above; totalsMap, ledgerMap and cashbookLines
    // contain the accumulated results and are used below to produce the reports.

    const trialBalance = accounts.map((account) => {
      const totals = totalsMap.get(account.id) ?? { debit: 0, credit: 0 };

      return {
        account_id: account.id,
        code: account.code,
        name: account.name,
        type: account.type,
        debit: totals.debit,
        credit: totals.credit,
        balance: totals.debit - totals.credit,
      };
    });

    const ledger = accounts
      .filter((account) => ledgerMap.has(account.id))
      .map((account) => {
        const lines = ledgerMap.get(account.id) ?? [];
        let runningBalance = 0;

        const datedLines = lines.map((line) => {
          runningBalance += line.debit - line.credit;

          return {
            ...line,
            running_balance: runningBalance,
          };
        });

        return {
          account_id: account.id,
          code: account.code,
          name: account.name,
          type: account.type,
          lines: datedLines,
        };
      });

    const incomeAccounts = accounts.filter((account) => account.type === 'INCOME');
    const expenseAccounts = accounts.filter((account) => account.type === 'EXPENSE');
    const assetAccounts = accounts.filter((account) => account.type === 'ASSET');
    const liabilityAccounts = accounts.filter((account) => account.type === 'LIABILITY');
    const equityAccounts = accounts.filter((account) => account.type === 'EQUITY');

    const incomeRows = incomeAccounts.map((account) => {
      const totals = totalsMap.get(account.id) ?? { debit: 0, credit: 0 };

      return {
        account_id: account.id,
        code: account.code,
        name: account.name,
        credit: totals.credit,
        debit: totals.debit,
        amount: totals.credit - totals.debit,
      };
    });

    const expenseRows = expenseAccounts.map((account) => {
      const totals = totalsMap.get(account.id) ?? { debit: 0, credit: 0 };

      return {
        account_id: account.id,
        code: account.code,
        name: account.name,
        debit: totals.debit,
        credit: totals.credit,
        amount: totals.debit - totals.credit,
      };
    });

    const totalIncome = incomeRows.reduce((sum, row) => sum + row.amount, 0);
    const totalExpenses = expenseRows.reduce((sum, row) => sum + row.amount, 0);
    const netIncome = totalIncome - totalExpenses;

    const balanceSheetAssets = assetAccounts.map((account) => {
      const totals = totalsMap.get(account.id) ?? { debit: 0, credit: 0 };

      return {
        account_id: account.id,
        code: account.code,
        name: account.name,
        amount: totals.debit - totals.credit,
      };
    });

    const balanceSheetLiabilities = liabilityAccounts.map((account) => {
      const totals = totalsMap.get(account.id) ?? { debit: 0, credit: 0 };

      return {
        account_id: account.id,
        code: account.code,
        name: account.name,
        amount: totals.credit - totals.debit,
      };
    });

    const balanceSheetEquity = equityAccounts.map((account) => {
      const totals = totalsMap.get(account.id) ?? { debit: 0, credit: 0 };

      return {
        account_id: account.id,
        code: account.code,
        name: account.name,
        amount: totals.credit - totals.debit,
      };
    });

    const balanceSheet = {
      assets: balanceSheetAssets,
      liabilities: balanceSheetLiabilities,
      equity: balanceSheetEquity,
      net_income: netIncome,
      total_assets: balanceSheetAssets.reduce((sum, row) => sum + row.amount, 0),
      total_liabilities: balanceSheetLiabilities.reduce((sum, row) => sum + row.amount, 0),
      total_equity: balanceSheetEquity.reduce((sum, row) => sum + row.amount, 0) + netIncome,
    };

    const reportBlueprints: GeneratedReport[] = [
      {
        type: 'CASHBOOK',
        name: 'Daily Cashbook',
        data: {
          business_id: business.id,
          business_name: business.name,
          as_of: range.end.toISOString(),
          entries: cashbookLines,
        },
      },
      {
        type: 'TRIAL_BALANCE',
        name: 'Daily Trial Balance',
        data: {
          business_id: business.id,
          business_name: business.name,
          as_of: range.end.toISOString(),
          accounts: trialBalance,
        },
      },
      {
        type: 'LEDGER',
        name: 'Daily Ledger',
        data: {
          business_id: business.id,
          business_name: business.name,
          as_of: range.end.toISOString(),
          accounts: ledger,
        },
      },
      {
        type: 'INCOME_STATEMENT',
        name: 'Daily Income Statement',
        data: {
          business_id: business.id,
          business_name: business.name,
          period_start: range.start.toISOString(),
          period_end: range.end.toISOString(),
          income: incomeRows,
          expenses: expenseRows,
          total_income: totalIncome,
          total_expenses: totalExpenses,
          net_income: netIncome,
        },
      },
      {
        type: 'BALANCE_SHEET',
        name: 'Daily Balance Sheet',
        data: {
          business_id: business.id,
          business_name: business.name,
          as_of: range.end.toISOString(),
          balance_sheet: balanceSheet,
        },
      },
    ];

    return this.prisma.$transaction(async (transaction: any) => {
      const createdReports: any[] = [];

      for (const blueprint of reportBlueprints) {
        await transaction.reports.deleteMany({
          where: {
            business_id: business.id,
            type: blueprint.type,
            period_start: range.start,
            period_end: range.end,
          },
        });

        const report = await transaction.reports.create({
          data: {
            id: randomUUID(),
            business_id: business.id,
            name: blueprint.name,
            type: blueprint.type,
            period_start: range.start,
            period_end: range.end,
            data: JSON.stringify(blueprint.data),
            status: 'GENERATED',
            format: 'JSON',
          },
        });

        createdReports.push(report);
      }

      return createdReports;
    });
  }

  private scheduleNextDailyRun() {
    if (this.dailyGenerationTimer) {
      clearTimeout(this.dailyGenerationTimer);
    }

    const now = new Date();
    const nextRun = new Date(now);
    nextRun.setDate(nextRun.getDate() + 1);
    nextRun.setHours(0, 5, 0, 0);

    const delay = Math.max(nextRun.getTime() - now.getTime(), 60_000);

    this.dailyGenerationTimer = setTimeout(async () => {
      try {
        await this.generateDailyFinancialStatements();
      } catch (error) {
        const message = error instanceof Error ? error.stack ?? error.message : String(error);
        this.logger.error('Scheduled daily report generation failed', message);
      } finally {
        this.scheduleNextDailyRun();
      }
    }, delay);
  }

  private getDayRange(asOfDate?: string | Date) {
    const date = asOfDate ? new Date(asOfDate) : new Date();

    if (Number.isNaN(date.getTime())) {
      throw new Error('Invalid report date');
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  private toAmount(value: unknown) {
    if (value == null) return 0;

    // Handle Prisma Decimal-like objects which expose `toNumber()` or `toJSNumber()`
    if (typeof value === 'object' && value !== null) {
      const v = value as any;
      if (typeof v.toNumber === 'function') {
        const n = v.toNumber();
        return Number.isFinite(n) ? n : 0;
      }
      if (typeof v.toJSNumber === 'function') {
        const n = v.toJSNumber();
        return Number.isFinite(n) ? n : 0;
      }
    }

    const amount = Number(value);
    return Number.isFinite(amount) ? amount : 0;
  }

  private isCashAccount(account?: AccountRow) {
    if (!account) {
      return false;
    }

    const identifier = `${account.code ?? ''} ${account.name}`.toLowerCase();

    return (
      account.type === 'ASSET' &&
      (identifier.includes('cash') || identifier.includes('bank') || identifier.includes('petty'))
    );
  }
}


