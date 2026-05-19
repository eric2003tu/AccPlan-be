import { ApiProperty } from '@nestjs/swagger';
import { BusinessDto } from './business.dto';
import { UserDto } from '../../users/dto/user.dto';

export class OwnerApplicationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  created_at?: Date;

  @ApiProperty({ type: BusinessDto })
  business: Record<string, unknown>;

  @ApiProperty({ type: UserDto })
  user: Record<string, unknown>;
}

export class OwnerApplicationsResponseDto {
  @ApiProperty({ description: 'Number of owner applications returned' })
  count: number;

  @ApiProperty({ description: 'Response status' })
  status?: string;

  @ApiProperty({ type: [OwnerApplicationDto] })
  data: OwnerApplicationDto[];
}