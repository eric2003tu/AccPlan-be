import { ApiProperty } from '@nestjs/swagger';
import {purchases_status as PurchaseStatus } from '@prisma/client';

export class PurchaseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty()
  supplier_id?: string;

  @ApiProperty()
  purchase_date?: Date;

  @ApiProperty()
  total: number;

  @ApiProperty()
  paid: number;

  @ApiProperty()
  status: PurchaseStatus;
}
