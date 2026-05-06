import { ApiProperty } from '@nestjs/swagger';
import { accounts_type } from '@prisma/client';

export class AccountDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty()
  code?: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: accounts_type })
  type: accounts_type;

  @ApiProperty()
  parent_id?: string;
}