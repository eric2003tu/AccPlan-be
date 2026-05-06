import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    return this.prisma.users.create({
      data: {
        id: uuid(),
        ...createUserDto,
      },
      select: { password: false, id: true, first_name: true, last_name: true, email: true, created_at: true },
    });
  }

  async findAll(skip = 0, take = 10) {
    return this.prisma.users.findMany({
      skip,
      take,
      select: { password: false, id: true, first_name: true, last_name: true, email: true, created_at: true },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: { password: false, id: true, first_name: true, last_name: true, email: true, created_at: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.users.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.prisma.users.findUnique({
        where: { email: updateUserDto.email },
      });
      if (existingEmail) {
        throw new BadRequestException('Email already exists');
      }
    }

    return this.prisma.users.update({
      where: { id },
      data: updateUserDto,
      select: { password: false, id: true, first_name: true, last_name: true, email: true, created_at: true },
    });
  }

  async remove(id: string) {
    const user = await this.prisma.users.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.users.delete({ where: { id } });
  }
}


