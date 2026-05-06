import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movement.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class StockMovementsService {
  constructor(private prisma: PrismaService) {}

  async create(createStockMovementDto: CreateStockMovementDto) {
    return this.prisma.stock_movements.create({
      data: {
        id: uuid(),
        ...createStockMovementDto,
      },
    });
  }

  async findAll(businessId?: string, skip = 0, take = 10) {
    return this.prisma.stock_movements.findMany({
      where: businessId ? { business_id: businessId } : {},
      skip,
      take,
    });
  }

  async findOne(id: string) {
    const stockMovement = await this.prisma.stock_movements.findUnique({
      where: { id },
    });

    if (!stockMovement) {
      throw new NotFoundException('Stock movement not found');
    }

    return stockMovement;
  }

  async update(id: string, updateStockMovementDto: UpdateStockMovementDto) {
    const stockMovement = await this.prisma.stock_movements.findUnique({ where: { id } });

    if (!stockMovement) {
      throw new NotFoundException('Stock movement not found');
    }

    return this.prisma.stock_movements.update({
      where: { id },
      data: updateStockMovementDto,
    });
  }

  async remove(id: string) {
    const stockMovement = await this.prisma.stock_movements.findUnique({ where: { id } });

    if (!stockMovement) {
      throw new NotFoundException('Stock movement not found');
    }

    return this.prisma.stock_movements.delete({ where: { id } });
  }
}


