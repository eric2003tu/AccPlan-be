import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReceivableDto } from './dto/create-receivable.dto';
import { UpdateReceivableDto } from './dto/update-receivable.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ReceivablesService {
  constructor(private prisma: PrismaService) {}

  async create(createReceivableDto: CreateReceivableDto) {
    return this.prisma.receivables.create({
      data: {
        id: uuid(),
        ...createReceivableDto,
      },
    });
  }

  async findAll(businessId?: string, skip = 0, take = 10) {
    return this.prisma.receivables.findMany({
      where: businessId ? { business_id: businessId } : {},
      skip,
      take,
    });
  }

  async findOne(id: string) {
    const receivable = await this.prisma.receivables.findUnique({
      where: { id },
    });

    if (!receivable) {
      throw new NotFoundException('Receivable not found');
    }

    return receivable;
  }

  async update(id: string, updateReceivableDto: UpdateReceivableDto) {
    const receivable = await this.prisma.receivables.findUnique({ where: { id } });

    if (!receivable) {
      throw new NotFoundException('Receivable not found');
    }

    return this.prisma.receivables.update({
      where: { id },
      data: updateReceivableDto,
    });
  }

  async remove(id: string) {
    const receivable = await this.prisma.receivables.findUnique({ where: { id } });

    if (!receivable) {
      throw new NotFoundException('Receivable not found');
    }

    return this.prisma.receivables.delete({ where: { id } });
  }
}


