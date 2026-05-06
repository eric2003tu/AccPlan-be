import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteSaleItemDto {
  @ApiProperty({ description: 'Sale item ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}