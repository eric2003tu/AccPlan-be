import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeletePurchaseItemDto {
  @ApiProperty({ description: 'Purchase item ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}