import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { accounts_type} from '@prisma/client';

export class CreateAccountDto {
  @ApiProperty({ description: 'Business ID' })
  @IsString()
  @IsNotEmpty()
  business_id: string;

  @ApiProperty({ description: 'Account code', required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ description: 'Account name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: accounts_type, description: 'Account type' })
  @IsEnum(accounts_type)
  @IsNotEmpty()
  type: accounts_type;

  @ApiProperty({ description: 'Parent account ID', required: false })
  @IsString()
  @IsOptional()
  parent_id?: string;
}