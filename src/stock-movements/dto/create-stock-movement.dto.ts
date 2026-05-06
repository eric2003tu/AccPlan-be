import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { $Enums } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateStockMovementDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  business_id: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  product_id?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  warehouse_id?: string;

  @ApiProperty({ enum: $Enums.stock_movements_type })
  @IsEnum($Enums.stock_movements_type)
  type: $Enums.stock_movements_type;

  @ApiProperty({ enum: $Enums.stock_movements_reference_type, required: false })
  @IsEnum($Enums.stock_movements_reference_type)
  @IsOptional()
  reference_type?: $Enums.stock_movements_reference_type;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reference_id?: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsOptional()
  unit_cost?: number;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  movement_date?: string;
}