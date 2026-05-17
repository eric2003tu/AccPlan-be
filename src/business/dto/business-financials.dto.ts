import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsNumber, ValidateNested } from 'class-validator';
import { BusinessMetricDto } from './business-metric.dto';

export class BusinessFinancialsDto {
  @ApiPropertyOptional({ description: 'Monthly revenue' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  monthlyRevenue?: number;

  @ApiPropertyOptional({ description: 'Monthly expenses' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  monthlyExpenses?: number;

  @ApiPropertyOptional({ description: 'Cash balance' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  cashBalance?: number;

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
  netProfit?: number;

  @ApiPropertyOptional({ description: 'Equity' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  equity?: number;

  @ApiPropertyOptional({ description: 'Overdue invoices' })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  overdueInvoices?: number;

  @ApiPropertyOptional({ type: [BusinessMetricDto], description: 'Monthly revenue trend' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessMetricDto)
  revenueTrend?: BusinessMetricDto[];

  @ApiPropertyOptional({ type: [BusinessMetricDto], description: 'Monthly expense breakdown' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessMetricDto)
  expenseBreakdown?: BusinessMetricDto[];
}
