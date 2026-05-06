import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.categories.create({
      data: createCategoryDto,
    });
  }

  async findAll(businessId?: string, skip = 0, take = 10) {
    return this.prisma.categories.findMany({
      where: businessId ? { business_id: businessId } : {},
      skip,
      take,
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.categories.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.categories.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.categories.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: number) {
    const category = await this.prisma.categories.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.categories.delete({ where: { id } });
  }
}


