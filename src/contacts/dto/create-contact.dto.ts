import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
import {contacts_type as ContactType } from '@prisma/client';

export class CreateContactDto {
  @ApiProperty({ description: 'Business ID' })
  @IsString()
  @IsNotEmpty()
  business_id: string;

  @ApiProperty({ description: 'Contact name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: ContactType, description: 'Contact type' })
  @IsEnum(ContactType)
  @IsNotEmpty()
  type: ContactType;

  @ApiProperty({ description: 'Phone number', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Email address', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;
}