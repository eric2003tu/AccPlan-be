import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleItemDto } from './dto/create-sale-item.dto';
import { UpdateSaleItemDto } from './dto/update-sale-item.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class SaleItemsService {
  constructor(private prisma: PrismaService) {}

  async create(createSaleItemDto: CreateSaleItemDto) {
    return this.prisma.salessItems.create({
      data: {
        id: uuid(),
        ...createSaleItemDto,
      },
    });
  }

  async findAll(saleId?: string, skip = 0, take = 10) {
    return this.prisma.salessItems.findMany({
      where: saleId ? { sale_id: saleId } : {},
      skip,
      take,
    });
  }

  async findOne(id: string) {
    const saleItem = await this.prisma.salessItems.findUnique({
      where: { id },
    });

    if (!saleItem) {
      throw new NotFoundException('Sale item not found');
    }

    return saleItem;
  }

  async update(id: string, updateSaleItemDto: UpdateSaleItemDto) {
    const saleItem = await this.prisma.salessItems.findUnique({ where: { id } });

    if (!saleItem) {
      throw new NotFoundException('Sale item not found');
    }

    return this.prisma.salessItems.update({
      where: { id },
      data: updateSaleItemDto,
    });
  }

  async remove(id: string) {
    const saleItem = await this.prisma.salessItems.findUnique({ where: { id } });

    if (!saleItem) {
      throw new NotFoundException('Sale item not found');
    }

    return this.prisma.salessItems.delete({ where: { id } });
  }
}


