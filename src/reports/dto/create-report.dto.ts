import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsDateString, IsEnum } from 'class-validator';

export const REPORT_TYPES = [
  'BALANCE_SHEET',
  'INCOME_STATEMENT',
  'TRIAL_BALANCE',
  'LEDGER',
  'CASHBOOK',
] as const;

export type ReportType = (typeof REPORT_TYPES)[number];

export class CreateReportDto {
  @ApiProperty({ description: 'Business ID' })
  @IsString()
  @IsNotEmpty()
  business_id!: string;

  @ApiProperty({ enum: REPORT_TYPES, description: 'Report type' })
  @IsEnum(REPORT_TYPES)
  type!: ReportType;

  @ApiProperty({ description: 'Report name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Period start', required: false })
  @IsDateString()
  @IsOptional()
  period_start?: string;

  @ApiProperty({ description: 'Period end', required: false })
  @IsDateString()
  @IsOptional()
  period_end?: string;

  @ApiProperty({ description: 'Data', required: false })
  @IsString()
  @IsOptional()
  data?: string;

  @ApiProperty({ description: 'File URL', required: false })
  @IsString()
  @IsOptional()
  file_url?: string;

  @ApiProperty({ description: 'Status', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ description: 'Format', required: false })
  @IsString()
  @IsOptional()
  format?: string;
}