import { ApiProperty } from '@nestjs/swagger';

export class JournalLineDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  journal_id: string;

  @ApiProperty()
  account_id?: string;

  @ApiProperty()
  debit: number;

  @ApiProperty()
  credit: number;
}
