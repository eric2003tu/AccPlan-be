import { ApiProperty } from '@nestjs/swagger';
import {journal_entries_reference_type as JournalReferenceType } from '@prisma/client';

export class JournalEntryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty()
  entry_date?: Date;

  @ApiProperty()
  reference?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  created_by?: string;

  @ApiProperty()
  reference_type?: JournalReferenceType;

  @ApiProperty()
  reference_id?: string;

  @ApiProperty()
  fiscal_year_id?: string;

  @ApiProperty()
  created_at: Date;
}
