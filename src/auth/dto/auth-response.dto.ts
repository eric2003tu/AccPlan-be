import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  first_name!: string;

  @ApiProperty()
  last_name!: string;

  @ApiProperty()
  email!: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  access_token!: string;

  @ApiProperty({ description: 'Token type', default: 'Bearer' })
  token_type!: string;

  @ApiProperty({ type: AuthUserDto })
  user!: AuthUserDto;
}
