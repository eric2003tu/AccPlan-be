import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteNotificationDto {
  @ApiProperty({ description: 'Notification ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}