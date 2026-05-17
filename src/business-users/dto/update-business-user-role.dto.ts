import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { business_users_role } from '@prisma/client';

export class UpdateBusinessUserRoleDto {
  @ApiProperty({ description: 'Business ID' })
  @IsString()
  @IsNotEmpty()
  business_id: string;

  @ApiProperty({ enum: business_users_role, description: 'Role' })
  @IsEnum(business_users_role)
  role: business_users_role;
}
