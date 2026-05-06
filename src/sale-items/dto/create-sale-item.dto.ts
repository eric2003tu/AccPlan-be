import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSaleItemDto {
  @ApiProperty({ description: 'Sale ID' })
  @IsString()
  @IsNotEmpty()
  sale_id: string;

  @ApiProperty({ description: 'Product ID', required: false })
  @IsString()
  @IsOptional()
  product_id?: string;

  @ApiProperty({ description: 'Quantity' })
  @IsNumber()
  @IsNotEmpty()
  qty: number;

  @ApiProperty({ description: 'Unit price' })
  @Type(() => Number)
  @IsNotEmpty()
  unit_price: number;

  @ApiProperty({ description: 'Total' })
  @Type(() => Number)
  @IsNotEmpty()
  total: number;
}