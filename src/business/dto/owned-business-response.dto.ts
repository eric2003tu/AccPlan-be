import { ApiProperty } from '@nestjs/swagger';
import { BusinessDto } from './business.dto';

export class OwnedBusinessResponseDto {
  @ApiProperty({ description: 'Number of business records returned' })
  count: number;

  @ApiProperty({ description: 'Business status' })
  status?: string;

  @ApiProperty({ type: BusinessDto })
  data: any;
}
