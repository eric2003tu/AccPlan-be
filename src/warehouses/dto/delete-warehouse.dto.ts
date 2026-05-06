import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteWarehouseDto {
  @ApiProperty({ description: 'Warehouse ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}