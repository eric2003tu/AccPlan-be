import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteCategoryDto {
  @ApiProperty({ description: 'Category ID' })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}