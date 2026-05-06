import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  async create(createPurchaseDto: CreatePurchaseDto) {
    return this.prisma.purchasess.create({
      data: {
        id: uuid(),
        ...createPurchaseDto,
      },
      include: { items: true },
    });
  }

  async findAll(businessId?: string, skip = 0, take = 10) {
    return this.prisma.purchasess.findMany({
      where: businessId ? { business_id: businessId } : {},
      skip,
      take,
      include: { items: true },
    });
  }

  async findOne(id: string) {
    const purchase = await this.prisma.purchasess.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }

    return purchase;
  }

  async update(id: string, updatePurchaseDto: UpdatePurchaseDto) {
    const purchase = await this.prisma.purchasess.findUnique({ where: { id } });

    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }

    return this.prisma.purchasess.update({
      where: { id },
      data: updatePurchaseDto,
      include: { items: true },
    });
  }

  async remove(id: string) {
    const purchase = await this.prisma.purchasess.findUnique({ where: { id } });

    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }

    return this.prisma.purchasess.delete({
      where: { id },
      include: { items: true },
    });
  }
}


