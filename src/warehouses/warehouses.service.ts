import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class WarehousesService {
  constructor(private prisma: PrismaService) {}

  async create(createWarehouseDto: CreateWarehouseDto) {
    return this.prisma.warehouses.create({
      data: {
        id: uuid(),
        ...createWarehouseDto,
      },
    });
  }

  async findAll(businessId?: string, skip = 0, take = 10) {
    return this.prisma.warehouses.findMany({
      where: businessId ? { business_id: businessId } : {},
      skip,
      take,
    });
  }

  async findOne(id: string) {
    const warehouse = await this.prisma.warehouses.findUnique({
      where: { id },
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    return warehouse;
  }

  async update(id: string, updateWarehouseDto: UpdateWarehouseDto) {
    const warehouse = await this.prisma.warehouses.findUnique({ where: { id } });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    return this.prisma.warehouses.update({
      where: { id },
      data: updateWarehouseDto,
    });
  }

  async remove(id: string) {
    const warehouse = await this.prisma.warehouses.findUnique({ where: { id } });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    return this.prisma.warehouses.delete({ where: { id } });
  }
}


