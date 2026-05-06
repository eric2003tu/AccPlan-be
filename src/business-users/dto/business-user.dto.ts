import { ApiProperty } from '@nestjs/swagger';
import { business_users_role } from '@prisma/client';

export class BusinessUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty({ enum: business_users_role })
  role: business_users_role;
}