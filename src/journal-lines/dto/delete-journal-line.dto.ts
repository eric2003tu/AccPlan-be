import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteJournalLineDto {
  @ApiProperty({ description: 'Journal line ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}