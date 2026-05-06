import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeletePayableDto {
  @ApiProperty({ description: 'Payable ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}