import { ApiProperty } from '@nestjs/swagger';
import { sales_status } from '@prisma/client';

export class SaleDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty()
  customer_id?: string;

  @ApiProperty()
  sale_date?: Date;

  @ApiProperty()
  total: number;

  @ApiProperty()
  paid: number;

  @ApiProperty({ enum: sales_status })
  status: sales_status;
}