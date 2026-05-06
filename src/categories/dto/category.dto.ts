import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  business_id?: string;

  @ApiProperty()
  name: string;
}
