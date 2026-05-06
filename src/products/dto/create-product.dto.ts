import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ description: 'Business ID' })
  @IsString()
  @IsNotEmpty()
  business_id: string;

  @ApiProperty({ description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'SKU', required: false })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({ description: 'Barcode', required: false })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiProperty({ description: 'Unit cost', required: false })
  @Type(() => Number)
  @IsOptional()
  unit_cost?: number;

  @ApiProperty({ description: 'Unit price', required: false })
  @Type(() => Number)
  @IsOptional()
  unit_price?: number;

  @ApiProperty({ description: 'Reorder level', required: false })
  @IsNumber()
  @IsOptional()
  reorder_level?: number;

  @ApiProperty({ description: 'Category ID', required: false })
  @IsNumber()
  @IsOptional()
  category_id?: number;
}