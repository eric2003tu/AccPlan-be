import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseItemDto } from './dto/create-purchase-item.dto';
import { UpdatePurchaseItemDto } from './dto/update-purchase-item.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PurchaseItemsService {
  constructor(private prisma: PrismaService) {}

  async create(createPurchaseItemDto: CreatePurchaseItemDto) {
    return this.prisma.purchasessItem.create({
      data: {
        id: uuid(),
        ...createPurchaseItemDto,
      },
    });
  }

  async findAll(purchaseId?: string, skip = 0, take = 10) {
    return this.prisma.purchasessItem.findMany({
      where: purchaseId ? { purchase_id: purchaseId } : {},
      skip,
      take,
    });
  }

  async findOne(id: string) {
    const purchaseItem = await this.prisma.purchasessItem.findUnique({
      where: { id },
    });

    if (!purchaseItem) {
      throw new NotFoundException('Purchase item not found');
    }

    return purchaseItem;
  }

  async update(id: string, updatePurchaseItemDto: UpdatePurchaseItemDto) {
    const purchaseItem = await this.prisma.purchasessItem.findUnique({ where: { id } });

    if (!purchaseItem) {
      throw new NotFoundException('Purchase item not found');
    }

    return this.prisma.purchasessItem.update({
      where: { id },
      data: updatePurchaseItemDto,
    });
  }

  async remove(id: string) {
    const purchaseItem = await this.prisma.purchasessItem.findUnique({ where: { id } });

    if (!purchaseItem) {
      throw new NotFoundException('Purchase item not found');
    }

    return this.prisma.purchasessItem.delete({ where: { id } });
  }
}


