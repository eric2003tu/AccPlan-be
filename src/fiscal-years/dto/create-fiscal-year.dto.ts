import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsDateString, IsEnum } from 'class-validator';
import { fiscal_years_status } from '@prisma/client';

export class CreateFiscalYearDto {
  @ApiProperty({ description: 'Business ID' })
  @IsString()
  @IsNotEmpty()
  business_id: string;

  @ApiProperty({ description: 'Fiscal year name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Start date', required: false })
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @ApiProperty({ description: 'End date', required: false })
  @IsDateString()
  @IsOptional()
  end_date?: string;

  @ApiProperty({ enum: fiscal_years_status, description: 'Status', required: false })
  @IsEnum(fiscal_years_status)
  @IsOptional()
  status?: fiscal_years_status;
}