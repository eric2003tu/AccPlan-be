import { ApiProperty } from '@nestjs/swagger';

export class SaleItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  sale_id: string;

  @ApiProperty()
  product_id?: string;

  @ApiProperty()
  qty: number;

  @ApiProperty()
  unit_price: number;

  @ApiProperty()
  total: number;
}
