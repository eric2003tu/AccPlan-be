import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsEnum, IsDateString } from 'class-validator';
import {purchases_status as PurchaseStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreatePurchaseDto {
  @ApiProperty({ description: 'Business ID' })
  @IsString()
  @IsNotEmpty()
  business_id: string;

  @ApiProperty({ description: 'Supplier ID', required: false })
  @IsString()
  @IsOptional()
  supplier_id?: string;

  @ApiProperty({ description: 'Purchase date', required: false })
  @IsDateString()
  @IsOptional()
  purchase_date?: string;

  @ApiProperty({ description: 'Total amount', required: false })
  @Type(() => Number)
  @IsOptional()
  total?: number;

  @ApiProperty({ description: 'Paid amount', required: false })
  @Type(() => Number)
  @IsOptional()
  paid?: number;

  @ApiProperty({ enum: PurchaseStatus, description: 'Purchase status', required: false })
  @IsEnum(PurchaseStatus)
  @IsOptional()
  status?: PurchaseStatus;
}