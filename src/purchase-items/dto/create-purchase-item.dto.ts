import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePurchaseItemDto {
  @ApiProperty({ description: 'Purchase ID' })
  @IsString()
  @IsNotEmpty()
  purchase_id: string;

  @ApiProperty({ description: 'Product ID', required: false })
  @IsString()
  @IsOptional()
  product_id?: string;

  @ApiProperty({ description: 'Quantity' })
  @IsNumber()
  @IsNotEmpty()
  qty: number;

  @ApiProperty({ description: 'Unit cost' })
  @Type(() => Number)
  @IsNotEmpty()
  unit_cost: number;

  @ApiProperty({ description: 'Total' })
  @Type(() => Number)
  @IsNotEmpty()
  total: number;
}