import { ApiProperty } from '@nestjs/swagger';

export class PurchaseItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  purchase_id: string;

  @ApiProperty()
  product_id?: string;

  @ApiProperty()
  qty: number;

  @ApiProperty()
  unit_cost: number;

  @ApiProperty()
  total: number;
}
