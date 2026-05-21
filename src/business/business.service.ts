import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { OwnedBusinessResponseDto } from './dto/owned-business-response.dto';
import { OwnerApplicationsResponseDto } from './dto/owner-applications-response.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  private normalizeTrendRows(rows?: { label: string; value: number }[]) {
    if (!rows) {
      return undefined;
    }

    return rows
      .filter((row) => row.label?.trim() !== '' || row.value !== undefined)
      .map((row) => ({
        label: row.label.trim(),
        value: Number(row.value),
      }));
  }

  private resolveFinancials(_businessDto: CreateBusinessDto | UpdateBusinessDto) {
    return {};
  }

  private buildBusinessData(businessDto: CreateBusinessDto | UpdateBusinessDto): Record<string, unknown> {
    const financials = this.resolveFinancials(businessDto);

    return {
      ...(businessDto.name !== undefined ? { name: businessDto.name } : {}),
      ...(businessDto.contact_email !== undefined ? { contact_email: businessDto.contact_email } : {}),
      ...(businessDto.phone !== undefined ? { phone: businessDto.phone } : {}),
      ...(businessDto.address !== undefined ? { address: businessDto.address } : {}),
      ...(businessDto.fiscal_year_start !== undefined ? { fiscal_year_start: new Date(businessDto.fiscal_year_start as any) } : {}),
      ...(businessDto.starting_money !== undefined ? { starting_money: businessDto.starting_money } : {}),
      ...(businessDto.loans !== undefined ? { loans: businessDto.loans } : {}),
      ...(businessDto.loans_offered !== undefined ? { loans_offered: businessDto.loans_offered } : {}),
      ...financials,
    };
  }

  async applyToBeOwner(userId: string) {
    // Check existing platform-level application (token-only owner application)
    const existing = await this.prisma.owner_applications.findFirst({ where: { business_id: null, user_id: userId } });
    if (existing && existing.status === 'PENDING') {
      throw new BadRequestException('Application already pending');
    }

    return this.prisma.owner_applications.create({
      data: {
        id: uuid(),
        business_id: null,
        user_id: userId,
        status: 'PENDING',
      },
    });
  }

  async adminApproveOwner(businessId: string, targetUserId: string) {
    // Only called by admin controller method which enforces admin role
    const business = await this.prisma.businesses.findUnique({ where: { id: businessId } });
    if (!business) throw new NotFoundException('Business not found');

    return this.prisma.$transaction(async (prisma) => {
      // create or update business_users to OWNER
      await prisma.business_users.upsert({
        where: { business_id_user_id: { business_id: businessId, user_id: targetUserId } },
        update: { role: 'OWNER' },
        create: { id: uuid(), business_id: businessId, user_id: targetUserId, role: 'OWNER' },
      } as any);

      // update system role on users
      await prisma.users.update({ where: { id: targetUserId }, data: { system_role: 'OWNER' } as any });

      // mark any application as approved if exists
      await prisma.owner_applications.updateMany({ where: { business_id: businessId, user_id: targetUserId }, data: { status: 'APPROVED' } });

      return { success: true };
    });
  }

  async adminApprovePlatformOwner(targetUserId: string) {
    return this.prisma.$transaction(async (prisma) => {
      // update system role on users
      await prisma.users.update({ where: { id: targetUserId }, data: { system_role: 'OWNER' } as any });

      // mark any platform-level application as approved if exists
      await prisma.owner_applications.updateMany({ where: { business_id: null, user_id: targetUserId }, data: { status: 'APPROVED' } });

      return { success: true };
    });
  }

  async getOwnerApplications(skip = 0, take?: number) {
    const applications = await this.prisma.owner_applications.findMany({
      include: {
        business: true,
        user: true,
      },
      orderBy: { created_at: 'desc' },
      skip,
      ...(typeof take === 'number' ? { take } : {}),
    });

    const data = applications.map((application) => ({
      id: application.id,
      status: application.status,
      created_at: application.created_at ?? undefined,
      business: application.business
        ? {
            name: application.business.name,
            contact_email: application.business.contact_email ?? undefined,
          }
        : undefined,
      user: application.user
        ? {
            first_name: application.user.first_name,
            last_name: application.user.last_name,
            email: application.user.email,
          }
        : undefined,
    }));

    return {
      count: applications.length,
      status: 'ok',
      data,
    } satisfies OwnerApplicationsResponseDto;
  }

  async assignManager(businessId: string, ownerUserId: string, targetUserId: string) {
    // verify acting user is owner of the business
    const ownerRecord = await this.prisma.business_users.findFirst({ where: { business_id: businessId, user_id: ownerUserId, role: 'OWNER' } });
    if (!ownerRecord) throw new ForbiddenException('Only business owner can assign managers');

    return this.prisma.$transaction(async (prisma) => {
      // upsert business_users for target user as MANAGER
      await prisma.business_users.upsert({
        where: { business_id_user_id: { business_id: businessId, user_id: targetUserId } },
        update: { role: 'MANAGER' },
        create: { id: uuid(), business_id: businessId, user_id: targetUserId, role: 'MANAGER' },
      } as any);

      // update system role on users
      await prisma.users.update({ where: { id: targetUserId }, data: { system_role: 'MANAGER' } as any });

      return { success: true };
    });
  }

  async create(createBusinessDto: CreateBusinessDto, ownerUserId: string) {
    const businessData = this.buildBusinessData(createBusinessDto);

    return this.prisma.$transaction(async (prisma) => {
      const business = await prisma.businesses.create({
          data: {
          id: uuid(),
          ...businessData,
        } as any,
      });

      await prisma.business_users.create({
        data: {
          id: uuid(),
          business_id: business.id,
          user_id: ownerUserId,
          role: 'OWNER',
        },
      });

      return business;
    });
  }

  async findAll(skip = 0, take = 10, userId?: string) {
    // If userId is provided, filter by user's business roles
    if (userId) {
      const userBusinesses = await this.prisma.business_users.findMany({
        where: { user_id: userId },
        select: { business_id: true },
      });

      const businessIds = userBusinesses.map((ub) => ub.business_id);

      if (businessIds.length === 0) {
        return [];
      }

      return this.prisma.businesses.findMany({
        where: { id: { in: businessIds } },
        include: {
          business_users: {
            include: { user: true },
          },
          accounts: true,
          categories: true,
          contacts: true,
          fiscal_years: true,
          journal_entries: {
            include: { lines: { include: { account: true } } },
          },
          notifications: true,
          products: true,
          purchases: {
            include: { items: true, supplier: true },
          },
          sales: {
            include: { items: true, customer: true },
          },
          stock_movements: true,
          warehouses: true,
          receivables: true,
          payables: true,
          reports: true,
        },
        skip,
        take,
      });
    }

    // If no userId, return all businesses (for system admin)
    return this.prisma.businesses.findMany({
      include: {
        business_users: {
          include: { user: true },
        },
        accounts: true,
        categories: true,
        contacts: true,
        fiscal_years: true,
        journal_entries: {
          include: { lines: { include: { account: true } } },
        },
        notifications: true,
        products: true,
        purchases: {
          include: { items: true, supplier: true },
        },
        sales: {
          include: { items: true, customer: true },
        },
        stock_movements: true,
        warehouses: true,
        receivables: true,
        payables: true,
        reports: true,
      },
      skip,
      take,
    });
  }

  async findOne(id: string) {
    const business = await this.prisma.businesses.findUnique({
      where: { id },
      include: {
        business_users: {
          include: { user: true },
        },
        accounts: true,
        categories: true,
        contacts: true,
        fiscal_years: true,
        journal_entries: {
          include: { lines: { include: { account: true } } },
        },
        notifications: true,
        products: true,
        purchases: {
          include: { items: true, supplier: true },
        },
        sales: {
          include: { items: true, customer: true },
        },
        stock_movements: true,
        warehouses: true,
        receivables: true,
        payables: true,
        reports: true,
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }

  async getOwnedBusiness(userId: string) {
    const ownershipRecords = await this.prisma.business_users.findMany({
      where: { user_id: userId, role: 'OWNER' },
      include: {
        business: {
          select: {
            id: true,
            created_at: true,
          },
        },
      },
    });

    if (ownershipRecords.length === 0) {
      throw new NotFoundException('No owned business found for this user');
    }

    const latestOwnership = ownershipRecords
      .slice()
      .sort((left, right) => {
        const leftCreatedAt = left.business?.created_at ? new Date(left.business.created_at).getTime() : 0;
        const rightCreatedAt = right.business?.created_at ? new Date(right.business.created_at).getTime() : 0;

        return rightCreatedAt - leftCreatedAt;
      })[0];

    const business = await this.findOne(latestOwnership.business_id);

    return {
      count: 1,
      status: (business as any).status ?? undefined,
      data: business as any,
    } satisfies OwnedBusinessResponseDto;
  }

  async getManagedBusiness(userId: string) {
    const managementRecord = await this.prisma.business_users.findFirst({
      where: { user_id: userId, role: 'MANAGER' },
      select: { business_id: true },
    });

    if (!managementRecord) {
      throw new NotFoundException('No managed business found for this user');
    }

    return this.findOne(managementRecord.business_id);
  }

  async getOwnerDashboard(userId: string) {
    // find businesses where user is OWNER, otherwise where user is MANAGER
    const ownerRecords = await this.prisma.business_users.findMany({ where: { user_id: userId, role: 'OWNER' }, select: { business_id: true } });
    let businessIds: string[] = ownerRecords.map((o) => o.business_id);
    let actorIsOwner = businessIds.length > 0;

    if (!actorIsOwner) {
      const managerRecords = await this.prisma.business_users.findMany({ where: { user_id: userId, role: 'MANAGER' }, select: { business_id: true } });
      businessIds = managerRecords.map((m) => m.business_id);
    }

    if (businessIds.length === 0) {
      throw new NotFoundException('No owned or managed businesses found for this user');
    }

    // totals
    const incomeAgg = await this.prisma.sales.aggregate({ _sum: { total: true }, where: { business_id: { in: businessIds } } });
    const expenseAgg = await this.prisma.purchases.aggregate({ _sum: { total: true }, where: { business_id: { in: businessIds } } });
    const cashAgg = await this.prisma.businesses.aggregate({ _sum: { cash_balance: true }, where: { id: { in: businessIds } } });
    const pendingInvoices = await this.prisma.receivables.count({ where: { business_id: { in: businessIds }, status: { in: ['OPEN','OVERDUE'] } } });

    const totalIncome = Number(incomeAgg._sum.total ?? 0);
    const totalExpenses = Number(expenseAgg._sum.total ?? 0);
    const accountBalance = Number(cashAgg._sum.cash_balance ?? 0);

    // recent transactions: combine recent sales, purchases, and journal entries
    const recentSales = await this.prisma.sales.findMany({ where: { business_id: { in: businessIds } }, orderBy: { sale_date: 'desc' }, take: 5 });
    const recentPurchases = await this.prisma.purchases.findMany({ where: { business_id: { in: businessIds } }, orderBy: { purchase_date: 'desc' }, take: 5 });
    const recentJournals = await this.prisma.journal_entries.findMany({ where: { business_id: { in: businessIds } }, orderBy: { created_at: 'desc' }, take: 5 });

    type Tx = { date: Date; type: string; sign: string; amount: number; description?: string };
    const txs: Tx[] = [];
    recentSales.forEach((s) => txs.push({ date: s.sale_date ?? new Date(), type: 'Portfolio Revenue', sign: '+', amount: Number(s.total ?? 0), description: `Sale ${s.id.slice(0,8)}` }));
    recentPurchases.forEach((p) => txs.push({ date: p.purchase_date ?? new Date(), type: 'Portfolio Expenses', sign: '-', amount: Number(p.total ?? 0), description: `Purchase ${p.id.slice(0,8)}` }));
    recentJournals.forEach((j) => txs.push({ date: j.entry_date ?? (j.created_at as Date) ?? new Date(), type: j.reference_type ?? 'Journal', sign: '+', amount: 0, description: j.description ?? j.reference ?? undefined }));

    // sort and take top 6
    txs.sort((a, b) => b.date.getTime() - a.date.getTime());
    const recent_transactions = txs.slice(0, 6).map((t) => ({ type: t.type, sign: t.sign, amount: t.amount, date: t.date.toISOString().slice(0,10), description: t.description }));

    // revenue trend (last 6 months)
    const dashboardNow = new Date();
    const months: { label: string; start: Date; end: Date }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(dashboardNow.getFullYear(), dashboardNow.getMonth() - i, 1);
      const label = d.toLocaleString('en-US', { month: 'short' });
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      months.push({ label, start, end });
    }

    const revenue_trend = [] as { label: string; value: number }[];
    const cashflow_trend = [] as { label: string; value: number }[];

    for (const m of months) {
      const salesSum = await this.prisma.sales.aggregate({ _sum: { total: true }, where: { business_id: { in: businessIds }, sale_date: { gte: m.start, lte: m.end } } });
      const purchasesSum = await this.prisma.purchases.aggregate({ _sum: { total: true }, where: { business_id: { in: businessIds }, purchase_date: { gte: m.start, lte: m.end } } });
      const rev = Number(salesSum._sum.total ?? 0);
      const exp = Number(purchasesSum._sum.total ?? 0);
      revenue_trend.push({ label: m.label, value: rev });
      cashflow_trend.push({ label: m.label, value: rev - exp });
    }

    // expense breakdown - best-effort buckets (seed creates purchases only)
    const expense_breakdown = {
      Salaries: { amount: 0, percent: 0 },
      Utilities: { amount: 0, percent: 0 },
      Rent: { amount: 0, percent: 0 },
      Marketing: { amount: 0, percent: 0 },
      Other: { amount: 0, percent: 0 },
    } as Record<string, { amount: number; percent: number }>;

    const gross_income = totalIncome;
    const net_profit = totalIncome - totalExpenses;

    // month-to-month stats for this month vs previous month
    const thisMonthStart = new Date(dashboardNow.getFullYear(), dashboardNow.getMonth(), 1);
    const thisMonthEnd = new Date(dashboardNow.getFullYear(), dashboardNow.getMonth() + 1, 0, 23, 59, 59);
    const prevMonthStart = new Date(dashboardNow.getFullYear(), dashboardNow.getMonth() - 1, 1);
    const prevMonthEnd = new Date(dashboardNow.getFullYear(), dashboardNow.getMonth(), 0, 23, 59, 59);

    const thisMonthIncomeAgg = await this.prisma.sales.aggregate({ _sum: { total: true }, where: { business_id: { in: businessIds }, sale_date: { gte: thisMonthStart, lte: thisMonthEnd } } });
    const prevMonthIncomeAgg = await this.prisma.sales.aggregate({ _sum: { total: true }, where: { business_id: { in: businessIds }, sale_date: { gte: prevMonthStart, lte: prevMonthEnd } } });
    const thisMonthExpenseAgg = await this.prisma.purchases.aggregate({ _sum: { total: true }, where: { business_id: { in: businessIds }, purchase_date: { gte: thisMonthStart, lte: thisMonthEnd } } });
    const prevMonthExpenseAgg = await this.prisma.purchases.aggregate({ _sum: { total: true }, where: { business_id: { in: businessIds }, purchase_date: { gte: prevMonthStart, lte: prevMonthEnd } } });

    const thisMonthIncome = Number(thisMonthIncomeAgg._sum.total ?? 0);
    const prevMonthIncome = Number(prevMonthIncomeAgg._sum.total ?? 0);
    const thisMonthExpenses = Number(thisMonthExpenseAgg._sum.total ?? 0);
    const prevMonthExpenses = Number(prevMonthExpenseAgg._sum.total ?? 0);

    const calcPct = (curr: number, prev: number) => {
      if (prev === 0) {
        return curr === 0 ? 0 : 100;
      }
      return ((curr - prev) / Math.abs(prev)) * 100;
    };

    const incomeChangePct = calcPct(thisMonthIncome, prevMonthIncome);
    const expenseChangePct = calcPct(thisMonthExpenses, prevMonthExpenses);

    const notePrefix = actorIsOwner ? 'All owned businesses' : 'Managed business(es)';
    const stat_cards = [
      { title: 'Total Income', value: totalIncome, change: Number(incomeChangePct.toFixed(2)), note: notePrefix },
      { title: 'Total Expenses', value: totalExpenses, change: Number(expenseChangePct.toFixed(2)), note: notePrefix },
      { title: 'Account Balance', value: accountBalance, note: 'Combined cash balance' },
      { title: 'Pending Invoices', value: pendingInvoices, note: 'Open or overdue invoices' },
    ];

    return {
      stat_cards,
      // stat cards
      total_income: totalIncome,
      total_income_month: thisMonthIncome,
      total_income_change_pct: Number(incomeChangePct.toFixed(2)),

      total_expenses: totalExpenses,
      total_expenses_month: thisMonthExpenses,
      total_expenses_change_pct: Number(expenseChangePct.toFixed(2)),

      account_balance: accountBalance,
      pending_invoices: pendingInvoices,

      // recent activity and summaries
      recent_transactions,
      gross_income,
      net_profit,

      // charts
      revenue_trend,
      cashflow_trend,
      expense_breakdown,
    };
  }

  async getAdminDashboard() {
    const totalBusinesses = await this.prisma.businesses.count();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    return {
      months,
      stat_cards: [
        {
          title: 'Managed Accounts',
          value: 12482,
          change: '+6%',
          note: 'Across all tenants',
        },
        {
          title: 'Security Alerts',
          value: 1,
          change: '-2%',
          note: 'Require review',
        },
        {
          title: 'Platform Uptime',
          value: 99.98,
          note: 'Last 30 days',
        },
        {
          title: 'Monthly Admin Revenue',
          value: 84300,
          change: '+9%',
          note: 'Subscriptions and addons',
        },
        {
          title: 'Total Businesses',
          value: totalBusinesses,
          note: 'Registered businesses',
        },
      ],
      revenue_trend: months.map((label, index) => ({
        label,
        value: [5200, 7800, 10200, 12800, 16800, 22000][index],
      })),
      cashflow_trend: months.map((label, index) => ({
        label,
        value: [2400, 3600, 5100, 6900, 9200, 13800][index],
      })),
      expense_breakdown: [
        { label: 'Salaries', amount: 15000, percent: 53.6 },
        { label: 'Utilities', amount: 2500, percent: 8.9 },
        { label: 'Rent', amount: 5000, percent: 17.9 },
        { label: 'Marketing', amount: 3500, percent: 12.5 },
        { label: 'Other', amount: 2000, percent: 7.1 },
      ],
    };
  }

  async update(id: string, updateBusinessDto: UpdateBusinessDto) {
    const business = await this.prisma.businesses.findUnique({ where: { id } });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return this.prisma.businesses.update({
      where: { id },
      data: this.buildBusinessData(updateBusinessDto) as any,
    });
  }

  async remove(id: string) {
    const business = await this.prisma.businesses.findUnique({ where: { id } });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return this.prisma.businesses.delete({ where: { id } });
  }
}


