import { ApiProperty } from '@nestjs/swagger';

class AdminDashboardStatCardDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  value: number;

  @ApiProperty({ required: false })
  change?: string;

  @ApiProperty({ required: false })
  note?: string;
}

class DashboardTrendPointDto {
  @ApiProperty()
  label: string;

  @ApiProperty()
  value: number;
}

class DashboardExpensePointDto {
  @ApiProperty()
  label: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  percent: number;
}

export class AdminDashboardDto {
  @ApiProperty({ type: [String] })
  months: string[];

  @ApiProperty({ type: [AdminDashboardStatCardDto] })
  stat_cards: AdminDashboardStatCardDto[];

  @ApiProperty({ type: [DashboardTrendPointDto] })
  revenue_trend: DashboardTrendPointDto[];

  @ApiProperty({ type: [DashboardTrendPointDto] })
  cashflow_trend: DashboardTrendPointDto[];

  @ApiProperty({ type: [DashboardExpensePointDto] })
  expense_breakdown: DashboardExpensePointDto[];
}
