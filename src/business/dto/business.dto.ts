import { ApiProperty } from '@nestjs/swagger';

export class BusinessDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  legal_name?: string;

  @ApiProperty()
  tax_id?: string;

  @ApiProperty()
  country?: string;

  @ApiProperty()
  city?: string;

  @ApiProperty()
  created_at: Date;
}
