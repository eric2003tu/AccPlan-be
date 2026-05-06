import { ApiProperty } from '@nestjs/swagger';
import {notifications_type as NotificationType } from '@prisma/client';

export class NotificationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty()
  user_id?: string;
 
  @ApiProperty()
  title?: string;

  @ApiProperty()
  message?: string;

  @ApiProperty()
  type: NotificationType;

  @ApiProperty()
  created_at: Date;
}
