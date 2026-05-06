import { ApiProperty } from '@nestjs/swagger';

export class WarehouseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  location?: string;
}
