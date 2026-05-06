import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeletePurchaseDto {
  @ApiProperty({ description: 'Purchase ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}