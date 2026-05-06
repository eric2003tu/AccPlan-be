import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFiscalYearDto } from './dto/create-fiscal-year.dto';
import { UpdateFiscalYearDto } from './dto/update-fiscal-year.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FiscalYearsService {
  constructor(private prisma: PrismaService) {}

  async create(createFiscalYearDto: CreateFiscalYearDto) {
    return this.prisma.fiscal_years.create({
      data: {
        id: uuid(),
        ...createFiscalYearDto,
      },
    });
  }

  async findAll(businessId?: string, skip = 0, take = 10) {
    return this.prisma.fiscal_years.findMany({
      where: businessId ? { business_id: businessId } : {},
      skip,
      take,
    });
  }

  async findOne(id: string) {
    const fiscalYear = await this.prisma.fiscal_years.findUnique({
      where: { id },
    });

    if (!fiscalYear) {
      throw new NotFoundException('Fiscal year not found');
    }

    return fiscalYear;
  }

  async update(id: string, updateFiscalYearDto: UpdateFiscalYearDto) {
    const fiscalYear = await this.prisma.fiscal_years.findUnique({ where: { id } });

    if (!fiscalYear) {
      throw new NotFoundException('Fiscal year not found');
    }

    return this.prisma.fiscal_years.update({
      where: { id },
      data: updateFiscalYearDto,
    });
  }

  async remove(id: string) {
    const fiscalYear = await this.prisma.fiscal_years.findUnique({ where: { id } });

    if (!fiscalYear) {
      throw new NotFoundException('Fiscal year not found');
    }

    return this.prisma.fiscal_years.delete({ where: { id } });
  }
}


