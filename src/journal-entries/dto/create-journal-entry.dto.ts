import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsDateString, IsEnum } from 'class-validator';
import {journal_entries_reference_type as JournalReferenceType } from '@prisma/client';

export class CreateJournalEntryDto {
  @ApiProperty({ description: 'Business ID' })
  @IsString()
  @IsNotEmpty()
  business_id: string;

  @ApiProperty({ description: 'Entry date', required: false })
  @IsDateString()
  @IsOptional()
  entry_date?: string;

  @ApiProperty({ description: 'Reference', required: false })
  @IsString()
  @IsOptional()
  reference?: string;

  @ApiProperty({ description: 'Description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Created by user ID', required: false })
  @IsString()
  @IsOptional()
  created_by?: string;

  @ApiProperty({ enum: JournalReferenceType, description: 'Reference type', required: false })
  @IsEnum(JournalReferenceType)
  @IsOptional()
  reference_type?: JournalReferenceType;

  @ApiProperty({ description: 'Reference ID', required: false })
  @IsString()
  @IsOptional()
  reference_id?: string;

  @ApiProperty({ description: 'Fiscal year ID', required: false })
  @IsString()
  @IsOptional()
  fiscal_year_id?: string;
}