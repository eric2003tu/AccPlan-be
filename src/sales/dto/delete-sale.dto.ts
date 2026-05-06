import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteSaleDto {
  @ApiProperty({ description: 'Sale ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}