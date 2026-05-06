import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteAccountDto {
  @ApiProperty({ description: 'Account ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}