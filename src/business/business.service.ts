import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  async create(createBusinessDto: CreateBusinessDto) {
    return this.prisma.businesses.create({
      data: {
        id: uuid(),
        ...createBusinessDto,
      },
    });
  }

  async findAll(skip = 0, take = 10, userId?: string) {
    // If userId is provided, filter by user's business roles
    if (userId) {
      const userBusinesses = await this.prisma.business_users.findMany({
        where: { user_id: userId },
        select: { business_id: true },
      });

      const businessIds = userBusinesses.map((ub) => ub.business_id);

      if (businessIds.length === 0) {
        return [];
      }

      return this.prisma.businesses.findMany({
        where: { id: { in: businessIds } },
        include: {
          business_users: {
            include: { user: true },
          },
          accounts: true,
          categories: true,
          contacts: true,
          fiscal_years: true,
          journal_entries: {
            include: { lines: { include: { account: true } } },
          },
          notifications: true,
          products: true,
          purchases: {
            include: { items: true, supplier: true },
          },
          sales: {
            include: { items: true, customer: true },
          },
          stock_movements: true,
          warehouses: true,
          receivables: true,
          payables: true,
          reports: true,
        },
        skip,
        take,
      });
    }

    // If no userId, return all businesses (for system admin)
    return this.prisma.businesses.findMany({
      include: {
        business_users: {
          include: { user: true },
        },
        accounts: true,
        categories: true,
        contacts: true,
        fiscal_years: true,
        journal_entries: {
          include: { lines: { include: { account: true } } },
        },
        notifications: true,
        products: true,
        purchases: {
          include: { items: true, supplier: true },
        },
        sales: {
          include: { items: true, customer: true },
        },
        stock_movements: true,
        warehouses: true,
        receivables: true,
        payables: true,
        reports: true,
      },
      skip,
      take,
    });
  }

  async findOne(id: string) {
    const business = await this.prisma.businesses.findUnique({
      where: { id },
      include: {
        business_users: {
          include: { user: true },
        },
        accounts: true,
        categories: true,
        contacts: true,
        fiscal_years: true,
        journal_entries: {
          include: { lines: { include: { account: true } } },
        },
        notifications: true,
        products: true,
        purchases: {
          include: { items: true, supplier: true },
        },
        sales: {
          include: { items: true, customer: true },
        },
        stock_movements: true,
        warehouses: true,
        receivables: true,
        payables: true,
        reports: true,
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }

  async getOwnedBusiness(userId: string) {
    const ownershipRecord = await this.prisma.business_users.findFirst({
      where: { user_id: userId, role: 'OWNER' },
      select: { business_id: true },
    });

    if (!ownershipRecord) {
      throw new NotFoundException('No owned business found for this user');
    }

    return this.findOne(ownershipRecord.business_id);
  }

  async getManagedBusiness(userId: string) {
    const managementRecord = await this.prisma.business_users.findFirst({
      where: { user_id: userId, role: 'MANAGER' },
      select: { business_id: true },
    });

    if (!managementRecord) {
      throw new NotFoundException('No managed business found for this user');
    }

    return this.findOne(managementRecord.business_id);
  }

  async update(id: string, updateBusinessDto: UpdateBusinessDto) {
    const business = await this.prisma.businesses.findUnique({ where: { id } });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return this.prisma.businesses.update({
      where: { id },
      data: updateBusinessDto,
    });
  }

  async remove(id: string) {
    const business = await this.prisma.businesses.findUnique({ where: { id } });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return this.prisma.businesses.delete({ where: { id } });
  }
}


