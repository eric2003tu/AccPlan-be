import { ApiProperty } from '@nestjs/swagger';

export class BusinessDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  contact_email?: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  address?: string;

  @ApiProperty()
  fiscal_year_start?: Date;

  @ApiProperty()
  starting_money?: number;

  @ApiProperty({ required: false, type: [Object] })
  loans?: unknown;

  @ApiProperty({ required: false, type: [Object] })
  loans_offered?: unknown;

  @ApiProperty()
  legal_name?: string;

  @ApiProperty()
  trade_name?: string;

  @ApiProperty()
  vat_number?: string;

  @ApiProperty()
  tax_id?: string;

  @ApiProperty()
  registration_no?: string;

  @ApiProperty()
  industry?: string;

  @ApiProperty()
  country?: string;

  @ApiProperty()
  city?: string;

  @ApiProperty()
  timezone?: string;

  @ApiProperty()
  subscription?: string;

  @ApiProperty()
  billing_cycle?: string;

  @ApiProperty()
  next_billing_date?: Date;

  @ApiProperty()
  status?: string;

  @ApiProperty()
  monthly_revenue?: number;

  @ApiProperty()
  monthly_expenses?: number;

  @ApiProperty()
  cash_balance?: number;

  @ApiProperty()
  receivables_balance?: number;

  @ApiProperty()
  payables_balance?: number;

  @ApiProperty()
  assets?: number;

  @ApiProperty()
  liabilities?: number;

  @ApiProperty()
  net_profit?: number;

  @ApiProperty()
  equity?: number;

  @ApiProperty()
  overdue_invoices?: number;

  @ApiProperty({ required: false, type: [Object] })
  revenue_trend?: unknown;

  @ApiProperty({ required: false, type: [Object] })
  expense_breakdown?: unknown;

  @ApiProperty()
  created_at: Date;
}
