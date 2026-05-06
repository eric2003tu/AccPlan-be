import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  sku?: string;

  @ApiProperty()
  barcode?: string;

  @ApiProperty()
  unit_cost: number;

  @ApiProperty()
  unit_price: number;

  @ApiProperty()
  reorder_level: number;

  @ApiProperty()
  category_id?: number;

  @ApiProperty()
  created_at: Date;
}
