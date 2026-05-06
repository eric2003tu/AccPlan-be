import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteBusinessDto {
  @ApiProperty({ description: 'Business ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}