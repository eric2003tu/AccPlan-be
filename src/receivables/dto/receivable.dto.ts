import { ApiProperty } from '@nestjs/swagger';
import { receivables_status as ReceivableStatus } from '@prisma/client';

export class ReceivableDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id?: string;

  @ApiProperty()
  customer_id?: string;

  @ApiProperty()
  reference_id?: string;

  @ApiProperty()
  amount?: number;

  @ApiProperty()
  due_date?: Date;

  @ApiProperty()
  status?: ReceivableStatus;
}
