import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { business_users_role } from '@prisma/client';

export class CreateBusinessUserDto {
  @ApiProperty({ description: 'Business ID' })
  @IsString()
  @IsNotEmpty()
  business_id: string;

  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ enum: business_users_role, description: 'Role' })
  @IsEnum(business_users_role)
  @IsNotEmpty()
  role: business_users_role;
}