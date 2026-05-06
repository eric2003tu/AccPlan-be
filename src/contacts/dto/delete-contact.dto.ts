import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteContactDto {
  @ApiProperty({ description: 'Contact ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}