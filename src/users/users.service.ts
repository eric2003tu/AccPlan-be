import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.prisma.users.findUnique({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      return await this.prisma.users.create({
        data: {
          id: uuid(),
          ...createUserDto,
        },
        select: { password: false, id: true, first_name: true, last_name: true, email: true, created_at: true },
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error?.code === 'P2002') {
        throw new BadRequestException('Email already exists');
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll(skip = 0, take = 10) {
    try {
      // Validate pagination parameters
      if (!Number.isInteger(skip) || !Number.isInteger(take) || skip < 0 || take < 0) {
        throw new BadRequestException('Skip and take parameters must be non-negative integers');
      }

      return await this.prisma.users.findMany({
        skip,
        take,
        select: { password: false, id: true, first_name: true, last_name: true, email: true, created_at: true },
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async findOne(id: string) {
    try {
      if (!id) {
        throw new BadRequestException('User ID is required');
      }

      const user = await this.prisma.users.findUnique({
        where: { id },
        select: { password: false, id: true, first_name: true, last_name: true, email: true, created_at: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      if (!id) {
        throw new BadRequestException('User ID is required');
      }

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

      return await this.prisma.users.update({
        where: { id },
        data: updateUserDto,
        select: { password: false, id: true, first_name: true, last_name: true, email: true, created_at: true },
      });
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      if (error?.code === 'P2002') {
        throw new BadRequestException('Email already exists');
      }
      if (error?.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: string) {
    try {
      if (!id) {
        throw new BadRequestException('User ID is required');
      }

      const user = await this.prisma.users.findUnique({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return await this.prisma.users.delete({ where: { id } });
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      if (error?.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}


