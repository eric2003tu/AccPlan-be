import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  async create(createBusinessDto: CreateBusinessDto) {
    return this.prisma.businesses.create({
      data: {
        id: uuid(),
        ...createBusinessDto,
      },
    });
  }

  async findAll(skip = 0, take = 10) {
    return this.prisma.businesses.findMany({
      skip,
      take,
    });
  }

  async findOne(id: string) {
    const business = await this.prisma.businesses.findUnique({
      where: { id },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }

  async update(id: string, updateBusinessDto: UpdateBusinessDto) {
    const business = await this.prisma.businesses.findUnique({ where: { id } });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return this.prisma.businesses.update({
      where: { id },
      data: updateBusinessDto,
    });
  }

  async remove(id: string) {
    const business = await this.prisma.businesses.findUnique({ where: { id } });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return this.prisma.businesses.delete({ where: { id } });
  }
}


