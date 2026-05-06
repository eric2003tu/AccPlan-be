import { ApiProperty } from '@nestjs/swagger';
import { contacts_type as ContactType } from '@prisma/client';

export class ContactDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: Object.values(ContactType) })
  type: ContactType;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  email?: string;
}