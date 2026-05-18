import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UserIdDto {
  @ApiProperty({ description: 'User id' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
