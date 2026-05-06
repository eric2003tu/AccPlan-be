import { ApiProperty } from '@nestjs/swagger';
import { fiscal_years_status } from '@prisma/client';

export class FiscalYearDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  start_date?: Date;

  @ApiProperty()
  end_date?: Date;

  @ApiProperty({ enum: fiscal_years_status })
  status: fiscal_years_status;
}