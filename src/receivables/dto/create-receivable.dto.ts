import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import {receivables_status as ReceivableStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateReceivableDto {
  @ApiProperty({ description: 'Business ID', required: false })
  @IsString()
  @IsOptional()
  business_id?: string;

  @ApiProperty({ description: 'Customer ID', required: false })
  @IsString()
  @IsOptional()
  customer_id?: string;

  @ApiProperty({ description: 'Reference ID', required: false })
  @IsString()
  @IsOptional()
  reference_id?: string;

  @ApiProperty({ description: 'Amount', required: false })
  @Type(() => Number)
  @IsOptional()
  amount?: number;

  @ApiProperty({ description: 'Due date', required: false })
  @IsDateString()
  @IsOptional()
  due_date?: string;

  @ApiProperty({ enum: ReceivableStatus, description: 'Status', required: false })
  @IsEnum(ReceivableStatus)
  @IsOptional()
  status?: ReceivableStatus;
}