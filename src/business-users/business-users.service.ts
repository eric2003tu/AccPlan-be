import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessUserDto } from './dto/create-business-user.dto';
import { UpdateBusinessUserDto } from './dto/update-business-user.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BusinessUsersService {
  constructor(private prisma: PrismaService) {}

  async create(createBusinessUserDto: CreateBusinessUserDto) {
    const existing = await this.prisma.business_users.findUnique({
      where: {
        business_id_user_id: {
          business_id: createBusinessUserDto.business_id,
          user_id: createBusinessUserDto.user_id,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('User already assigned to this business');
    }

    return this.prisma.business_users.create({
      data: {
        id: uuid(),
        ...createBusinessUserDto,
      },
    });
  }

  async findAll(skip = 0, take = 10) {
    return this.prisma.business_users.findMany({
      skip,
      take,
    });
  }

  async findOne(id: string) {
    const businessUser = await this.prisma.business_users.findUnique({
      where: { id },
    });

    if (!businessUser) {
      throw new NotFoundException('Business user not found');
    }

    return businessUser;
  }

  async update(id: string, updateBusinessUserDto: UpdateBusinessUserDto) {
    const businessUser = await this.prisma.business_users.findUnique({ where: { id } });

    if (!businessUser) {
      throw new NotFoundException('Business user not found');
    }

    return this.prisma.business_users.update({
      where: { id },
      data: updateBusinessUserDto,
    });
  }

  async remove(id: string) {
    const businessUser = await this.prisma.business_users.findUnique({ where: { id } });

    if (!businessUser) {
      throw new NotFoundException('Business user not found');
    }

    return this.prisma.business_users.delete({ where: { id } });
  }
}


