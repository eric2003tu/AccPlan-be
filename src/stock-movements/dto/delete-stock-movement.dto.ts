import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteStockMovementDto {
  @ApiProperty({ description: 'Stock movement ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}