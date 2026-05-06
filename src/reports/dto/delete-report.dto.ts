import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteReportDto {
  @ApiProperty({ description: 'Report ID' })
  @IsString()
  @IsNotEmpty()
  id!: string;
}