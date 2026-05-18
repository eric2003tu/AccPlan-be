import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateBusinessDto {
  @ApiProperty({ description: 'Business name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Contact email' })
  @IsOptional()
  @IsString()
  contact_email?: string;

  @ApiPropertyOptional({ description: 'Phone' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Fiscal year start (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  fiscal_year_start?: string;

  @ApiPropertyOptional({ description: 'Starting money amount' })
  @IsOptional()
  @IsNumber()
  starting_money?: number;

  @ApiPropertyOptional({ description: 'Loans (JSON array)' })
  @IsOptional()
  loans?: unknown;

  @ApiPropertyOptional({ description: 'Loans offered (JSON array)' })
  @IsOptional()
  loans_offered?: unknown;
}