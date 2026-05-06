import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { $Enums } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateSaleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  business_id!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  customer_id?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  sale_date?: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsOptional()
  total?: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsOptional()
  paid?: number;

  @ApiProperty({ enum: $Enums.sales_status })
  @IsEnum($Enums.sales_status)
  @IsOptional()
  status?: $Enums.sales_status;
}