import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteReceivableDto {
  @ApiProperty({ description: 'Receivable ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}