import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { compare, hash } from 'bcryptjs';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.userss.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await hash(registerDto.password, 10);

    const user = await this.prisma.userss.create({
      data: {
        id: randomUUID(),
        first_name: registerDto.first_name,
        last_name: registerDto.last_name,
        email: registerDto.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
    });

    const access_token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      access_token,
      token_type: 'Bearer',
      user,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.userss.findUnique({
      where: { email: loginDto.email },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await compare(loginDto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const access_token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      access_token,
      token_type: 'Bearer',
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    };
  }
}


