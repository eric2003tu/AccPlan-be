import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateJournalLineDto {
  @ApiProperty({ description: 'Journal ID' })
  @IsString()
  @IsNotEmpty()
  journal_id!: string;

  @ApiProperty({ description: 'Account ID', required: false })
  @IsString()
  @IsOptional()
  account_id?: string;

  @ApiProperty({ description: 'Debit amount', required: false })
  @Type(() => Number)
  @IsOptional()
  debit?: number;

  @ApiProperty({ description: 'Credit amount', required: false })
  @Type(() => Number)
  @IsOptional()
  credit?: number;
}