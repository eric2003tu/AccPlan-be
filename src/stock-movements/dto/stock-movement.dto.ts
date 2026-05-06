import { ApiProperty } from '@nestjs/swagger';
import { stock_movements_type, stock_movements_reference_type } from '@prisma/client';

export class StockMovementDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty()
  product_id?: string;

  @ApiProperty()
  warehouse_id?: string;

  @ApiProperty({ enum: stock_movements_type })
  type: stock_movements_type;

  @ApiProperty({ enum: stock_movements_reference_type })
  reference_type?: stock_movements_reference_type;

  @ApiProperty()
  reference_id?: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unit_cost?: number;

  @ApiProperty()
  movement_date?: Date;
}