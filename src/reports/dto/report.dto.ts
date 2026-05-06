import { ApiProperty } from '@nestjs/swagger';
import {reports_type as ReportType } from '@prisma/client';

export class ReportDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  business_id!: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  type?: ReportType;

  @ApiProperty()
  period_start?: Date;

  @ApiProperty()
  period_end?: Date;

  @ApiProperty()
  data?: string;

  @ApiProperty()
  file_url?: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  format!: string;

  @ApiProperty()
  generated_at!: Date;
}
