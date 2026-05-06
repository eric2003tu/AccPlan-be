import { ApiProperty } from '@nestjs/swagger';
import {payables_status as PayableStatus } from '@prisma/client';

export class PayableDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id?: string;

  @ApiProperty()
  supplier_id?: string;

  @ApiProperty()
  reference_id?: string;

  @ApiProperty()
  amount?: number;

  @ApiProperty()
  due_date?: Date;

  @ApiProperty()
  status?: PayableStatus;
}
