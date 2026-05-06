import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePayableDto } from './dto/create-payable.dto';
import { UpdatePayableDto } from './dto/update-payable.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PayablesService {
  constructor(private prisma: PrismaService) {}

  async create(createPayableDto: CreatePayableDto) {
    return this.prisma.payabless.create({
      data: {
        id: uuid(),
        ...createPayableDto,
      },
    });
  }

  async findAll(businessId?: string, skip = 0, take = 10) {
    return this.prisma.payabless.findMany({
      where: businessId ? { business_id: businessId } : {},
      skip,
      take,
    });
  }

  async findOne(id: string) {
    const payable = await this.prisma.payabless.findUnique({
      where: { id },
    });

    if (!payable) {
      throw new NotFoundException('Payable not found');
    }

    return payable;
  }

  async update(id: string, updatePayableDto: UpdatePayableDto) {
    const payable = await this.prisma.payabless.findUnique({ where: { id } });

    if (!payable) {
      throw new NotFoundException('Payable not found');
    }

    return this.prisma.payabless.update({
      where: { id },
      data: updatePayableDto,
    });
  }

  async remove(id: string) {
    const payable = await this.prisma.payabless.findUnique({ where: { id } });

    if (!payable) {
      throw new NotFoundException('Payable not found');
    }

    return this.prisma.payabless.delete({ where: { id } });
  }
}


