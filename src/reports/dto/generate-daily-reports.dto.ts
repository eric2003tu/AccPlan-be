import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class GenerateDailyReportsDto {
  @ApiProperty({ description: 'Generate reports for this date', required: false })
  @IsDateString()
  @IsOptional()
  asOfDate?: string;
}