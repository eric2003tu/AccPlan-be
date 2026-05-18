import { ApiProperty } from '@nestjs/swagger';

class RecentTransactionDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  sign: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  date: string;

  @ApiProperty()
  description?: string;
}

class TrendPointDto {
  @ApiProperty()
  label: string;

  @ApiProperty()
  value: number;
}

export class OwnerDashboardDto {
  @ApiProperty()
  total_income: number;

  @ApiProperty()
  total_income_month: number;

  @ApiProperty()
  total_income_change_pct: number;

  @ApiProperty()
  total_expenses: number;

  @ApiProperty()
  total_expenses_month: number;

  @ApiProperty()
  total_expenses_change_pct: number;

  @ApiProperty()
  account_balance: number;

  @ApiProperty()
  pending_invoices: number;

  @ApiProperty({ type: [RecentTransactionDto] })
  recent_transactions: RecentTransactionDto[];

  @ApiProperty()
  gross_income: number;

  @ApiProperty()
  net_profit: number;

  @ApiProperty({ type: [TrendPointDto] })
  revenue_trend: TrendPointDto[];

  @ApiProperty({ type: [TrendPointDto] })
  cashflow_trend: TrendPointDto[];

  @ApiProperty()
  expense_breakdown: Record<string, { amount: number; percent: number }>;
}

export default OwnerDashboardDto;
