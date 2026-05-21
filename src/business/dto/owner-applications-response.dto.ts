import { ApiProperty } from '@nestjs/swagger';

export class OwnerApplicationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  created_at?: Date;

  @ApiProperty({
    required: false,
    type: Object,
    description: 'Business summary without internal identifiers',
  })
  business?: {
    name?: string;
    contact_email?: string;
  };

  @ApiProperty({
    required: false,
    type: Object,
    description: 'Applicant summary without internal identifiers',
  })
  user?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

export class OwnerApplicationsResponseDto {
  @ApiProperty({ description: 'Number of owner applications returned' })
  count: number;

  @ApiProperty({ description: 'Response status' })
  status?: string;

  @ApiProperty({ type: [OwnerApplicationDto] })
  data: OwnerApplicationDto[];
}