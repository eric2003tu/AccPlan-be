import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { business_users_role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessUserDto } from './dto/create-business-user.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BusinessUsersService {
  constructor(private prisma: PrismaService) {}

  async getOwnedBusinessId(userId: string) {
    const ownershipRecord = await this.prisma.business_users.findFirst({
      where: { user_id: userId, role: 'OWNER' },
      select: { business_id: true },
    });

    if (!ownershipRecord) {
      throw new NotFoundException('No owned business found for this user');
    }

    return ownershipRecord.business_id;
  }

  async ensureUserOwnsBusiness(userId: string, businessId: string) {
    const ownershipRecord = await this.prisma.business_users.findFirst({
      where: { user_id: userId, business_id: businessId, role: 'OWNER' },
      select: { business_id: true },
    });

    if (!ownershipRecord) {
      throw new ForbiddenException('You can only manage business users for your own business');
    }
  }

  async findManagedBusinessUserForOwner(businessId: string, businessUserIdentifier: string) {
    const businessUser = await this.prisma.business_users.findFirst({
      where: {
        business_id: businessId,
        OR: [{ id: businessUserIdentifier }, { user_id: businessUserIdentifier }],
      },
    });

    if (!businessUser) {
      throw new NotFoundException('Business user not found');
    }

    return businessUser;
  }

  async create(createBusinessUserDto: CreateBusinessUserDto) {
    const existing = await this.prisma.business_users.findUnique({
      where: {
        business_id_user_id: {
          business_id: createBusinessUserDto.business_id,
          user_id: createBusinessUserDto.user_id,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('User already assigned to this business');
    }

    return this.prisma.business_users.create({
      data: {
        id: uuid(),
        ...createBusinessUserDto,
      },
    });
  }

  async findAll(skip = 0, take = 10, businessId?: string) {
    return this.prisma.business_users.findMany({
      where: businessId ? { business_id: businessId } : {},
      skip,
      take,
    });
  }

  async findOne(id: string) {
    const businessUser = await this.prisma.business_users.findUnique({
      where: { id },
    });

    if (!businessUser) {
      throw new NotFoundException('Business user not found');
    }

    return businessUser;
  }

  async updateRole(id: string, role: business_users_role) {
    const businessUser = await this.prisma.business_users.findUnique({ where: { id } });

    if (!businessUser) {
      throw new NotFoundException('Business user not found');
    }

    if (!role) {
      throw new BadRequestException('Role is required');
    }

    return this.prisma.business_users.update({
      where: { id },
      data: { role },
    });
  }

  async remove(id: string) {
    const businessUser = await this.prisma.business_users.findUnique({ where: { id } });

    if (!businessUser) {
      throw new NotFoundException('Business user not found');
    }

    return this.prisma.business_users.delete({ where: { id } });
  }
}


