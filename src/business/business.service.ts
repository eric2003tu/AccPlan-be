import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { OwnedBusinessResponseDto } from './dto/owned-business-response.dto';
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

  private resolveFinancials(businessDto: CreateBusinessDto | UpdateBusinessDto) {
    const financials = businessDto.financials ?? {};

    const monthlyRevenue = businessDto.monthly_revenue ?? financials.monthlyRevenue;
    const monthlyExpenses = businessDto.monthly_expenses ?? financials.monthlyExpenses;
    const cashBalance = businessDto.cash_balance ?? financials.cashBalance;
    const receivables = businessDto.receivables ?? financials.receivables;
    const payables = businessDto.payables ?? financials.payables;
    const assets = businessDto.assets ?? financials.assets;
    const liabilities = businessDto.liabilities ?? financials.liabilities;
    const overdueInvoices = businessDto.overdue_invoices ?? financials.overdueInvoices;

    const revenueTrend = businessDto.revenue_trend ?? financials.revenueTrend;
    const expenseBreakdown = businessDto.expense_breakdown ?? financials.expenseBreakdown;

    const parsedRevenue = Number(monthlyRevenue ?? 0);
    const parsedExpenses = Number(monthlyExpenses ?? 0);
    const parsedAssets = Number(assets ?? 0);
    const parsedLiabilities = Number(liabilities ?? 0);

    return {
      monthly_revenue: monthlyRevenue,
      monthly_expenses: monthlyExpenses,
      cash_balance: cashBalance,
      receivables_balance: receivables,
      payables_balance: payables,
      assets,
      liabilities,
      net_profit: parsedRevenue - parsedExpenses,
      equity: parsedAssets - parsedLiabilities,
      overdue_invoices: overdueInvoices,
      revenue_trend: this.normalizeTrendRows(revenueTrend),
      expense_breakdown: this.normalizeTrendRows(expenseBreakdown),
    };
  }

  private buildBusinessData(businessDto: CreateBusinessDto | UpdateBusinessDto): Record<string, unknown> {
    const financials = this.resolveFinancials(businessDto);

    return {
      ...(businessDto.name !== undefined ? { name: businessDto.name } : {}),
      ...(businessDto.legal_name !== undefined ? { legal_name: businessDto.legal_name } : {}),
      ...(businessDto.trade_name !== undefined ? { trade_name: businessDto.trade_name } : {}),
      ...(businessDto.vat_number !== undefined ? { vat_number: businessDto.vat_number } : {}),
      ...(businessDto.tax_id !== undefined ? { tax_id: businessDto.tax_id } : {}),
      ...(businessDto.registration_no !== undefined ? { registration_no: businessDto.registration_no } : {}),
      ...(businessDto.industry !== undefined ? { industry: businessDto.industry } : {}),
      ...(businessDto.country !== undefined ? { country: businessDto.country } : {}),
      ...(businessDto.city !== undefined ? { city: businessDto.city } : {}),
      ...(businessDto.timezone !== undefined ? { timezone: businessDto.timezone } : {}),
      ...(businessDto.subscription !== undefined ? { subscription: businessDto.subscription } : {}),
      ...(businessDto.billing_cycle !== undefined ? { billing_cycle: businessDto.billing_cycle } : {}),
      ...(businessDto.next_billing_date !== undefined ? { next_billing_date: new Date(businessDto.next_billing_date) } : {}),
      ...(businessDto.status !== undefined ? { status: businessDto.status } : {}),
      ...financials,
    };
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


