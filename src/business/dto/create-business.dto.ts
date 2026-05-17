import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsIn, IsInt, IsNumber, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { billingCycles, businessStatuses, countries, industries, subscriptionPlans, timezones } from '../business.constants';
import { BusinessFinancialsDto } from './business-financials.dto';
import { BusinessMetricDto } from './business-metric.dto';

export class CreateBusinessDto {
  @ApiProperty({ description: 'Business name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Legal business name' })
  @IsString()
  @IsNotEmpty()
  legal_name: string;

  @ApiPropertyOptional({ description: 'Trade name' })
  @IsString()
  @IsOptional()
  trade_name?: string;

  @ApiPropertyOptional({ description: 'VAT number' })
  @IsString()
  @IsOptional()
  vat_number?: string;

  @ApiPropertyOptional({ description: 'Legacy tax ID alias' })
  @IsString()
  @IsOptional()
  tax_id?: string;

  @ApiProperty({ description: 'Registration number' })
  @IsString()
  @IsNotEmpty()
  registration_no: string;

  @ApiProperty({ enum: industries, description: 'Industry' })
  @IsString()
  @IsIn(industries)
  industry: (typeof industries)[number];

  @ApiProperty({ enum: countries, description: 'Country' })
  @IsString()
  @IsIn(countries)
  country?: string;

  @ApiProperty({ description: 'City' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ enum: timezones, description: 'Timezone' })
  @IsString()
  @IsIn(timezones)
  timezone: (typeof timezones)[number];

  @ApiProperty({ enum: subscriptionPlans, description: 'Subscription plan' })
  @IsString()
  @IsIn(subscriptionPlans)
  subscription: (typeof subscriptionPlans)[number];

  @ApiProperty({ enum: billingCycles, description: 'Billing cycle' })
  @IsString()
  @IsIn(billingCycles)
  billing_cycle: (typeof billingCycles)[number];

  @ApiProperty({ description: 'Next billing date' })
  @IsDateString()
  next_billing_date: string;

  @ApiProperty({ enum: businessStatuses, description: 'Business status' })
  @IsString()
  @IsIn(businessStatuses)
  status: (typeof businessStatuses)[number];

  @ApiPropertyOptional({ description: 'Monthly revenue' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  monthly_revenue?: number;

  @ApiPropertyOptional({ description: 'Monthly expenses' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  monthly_expenses?: number;

  @ApiPropertyOptional({ description: 'Cash balance' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  cash_balance?: number;

  @ApiPropertyOptional({ description: 'Receivables' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  receivables?: number;

  @ApiPropertyOptional({ description: 'Payables' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  payables?: number;

  @ApiPropertyOptional({ description: 'Assets' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  assets?: number;

  @ApiPropertyOptional({ description: 'Liabilities' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  liabilities?: number;

  @ApiPropertyOptional({ description: 'Net profit' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  net_profit?: number;

  @ApiPropertyOptional({ description: 'Equity' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  equity?: number;

  @ApiPropertyOptional({ description: 'Overdue invoices' })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  overdue_invoices?: number;

  @ApiPropertyOptional({ type: [BusinessMetricDto], description: 'Revenue trend' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessMetricDto)
  revenue_trend?: BusinessMetricDto[];

  @ApiPropertyOptional({ type: [BusinessMetricDto], description: 'Expense breakdown' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessMetricDto)
  expense_breakdown?: BusinessMetricDto[];

  @ApiPropertyOptional({ type: BusinessFinancialsDto, description: 'Nested financial snapshot payload' })
  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessFinancialsDto)
  financials?: BusinessFinancialsDto;
}