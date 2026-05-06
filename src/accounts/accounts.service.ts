import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(createAccountDto: CreateAccountDto) {
    return this.prisma.accounts.create({
      data: {
        id: uuid(),
        ...createAccountDto,
      },
    });
  }

  async findAll(businessId?: string, skip = 0, take = 10) {
    return this.prisma.accounts.findMany({
      where: businessId ? { business_id: businessId } : {},
      skip,
      take,
    });
  }

  async findOne(id: string) {
    const account = await this.prisma.accounts.findUnique({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    const account = await this.prisma.accounts.findUnique({ where: { id } });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return this.prisma.accounts.update({
      where: { id },
      data: updateAccountDto,
    });
  }

  async remove(id: string) {
    const account = await this.prisma.accounts.findUnique({ where: { id } });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return this.prisma.accounts.delete({ where: { id } });
  }
}


