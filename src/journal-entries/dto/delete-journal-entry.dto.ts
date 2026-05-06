import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteJournalEntryDto {
  @ApiProperty({ description: 'Journal entry ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}