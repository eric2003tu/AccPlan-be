import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}