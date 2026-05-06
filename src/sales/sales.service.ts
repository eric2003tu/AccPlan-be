import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async create(createSaleDto: CreateSaleDto) {
    return this.prisma.sales.create({
      data: {
        id: uuid(),
        ...createSaleDto,
      },
      include: { items: true },
    });
  }

  async findAll(businessId?: string, skip = 0, take = 10) {
    return this.prisma.sales.findMany({
      where: businessId ? { business_id: businessId } : {},
      skip,
      take,
      include: { items: true },
    });
  }

  async findOne(id: string) {
    const sale = await this.prisma.sales.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    return sale;
  }

  async update(id: string, updateSaleDto: UpdateSaleDto) {
    const sale = await this.prisma.sales.findUnique({ where: { id } });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    return this.prisma.sales.update({
      where: { id },
      data: updateSaleDto,
      include: { items: true },
    });
  }

  async remove(id: string) {
    const sale = await this.prisma.sales.findUnique({ where: { id } });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    return this.prisma.sales.delete({
      where: { id },
      include: { items: true },
    });
  }
}


