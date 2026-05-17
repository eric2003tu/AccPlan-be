import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BusinessMetricDto {
  @ApiProperty({ description: 'Metric label' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ description: 'Metric value' })
  @Type(() => Number)
  @IsNumber()
  value: number;
}
