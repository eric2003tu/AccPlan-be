import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { notifications_type as NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @ApiProperty({ description: 'Business ID' })
  @IsString()
  @IsNotEmpty()
  business_id: string;

  @ApiProperty({ description: 'User ID', required: false })
  @IsString()
  @IsOptional()
  user_id?: string;

  @ApiProperty({ description: 'Title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Message', required: false })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({ enum: NotificationType, description: 'Notification type' })
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;
}