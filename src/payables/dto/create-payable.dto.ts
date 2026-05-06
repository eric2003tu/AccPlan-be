import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import {payables_status as PayableStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreatePayableDto {
  @ApiProperty({ description: 'Business ID', required: false })
  @IsString()
  @IsOptional()
  business_id?: string;

  @ApiProperty({ description: 'Supplier ID', required: false })
  @IsString()
  @IsOptional()
  supplier_id?: string;

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

  @ApiProperty({ enum: PayableStatus, description: 'Status', required: false })
  @IsEnum(PayableStatus)
  @IsOptional()
  status?: PayableStatus;
}