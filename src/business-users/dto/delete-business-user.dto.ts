import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteBusinessUserDto {
  @ApiProperty({ description: 'Business user ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}