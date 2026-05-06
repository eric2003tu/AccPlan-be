import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateWarehouseDto {
  @ApiProperty({ description: 'Business ID' })
  @IsString()
  @IsNotEmpty()
  business_id: string;

  @ApiProperty({ description: 'Warehouse name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Location', required: false })
  @IsString()
  @IsOptional()
  location?: string;
}