import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateBusinessDto {
  @ApiProperty({ description: 'Business name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Legal business name', required: false })
  @IsString()
  @IsOptional()
  legal_name?: string;

  @ApiProperty({ description: 'Tax ID', required: false })
  @IsString()
  @IsOptional()
  tax_id?: string;

  @ApiProperty({ description: 'Country', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ description: 'City', required: false })
  @IsString()
  @IsOptional()
  city?: string;
}