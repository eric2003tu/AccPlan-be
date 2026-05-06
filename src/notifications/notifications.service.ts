import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    return this.prisma.notifications.create({
      data: {
        id: uuid(),
        ...createNotificationDto,
      },
    });
  }

  async findAll(businessId?: string, skip = 0, take = 10) {
    return this.prisma.notifications.findMany({
      where: businessId ? { business_id: businessId } : {},
      skip,
      take,
    });
  }

  async findOne(id: string) {
    const notification = await this.prisma.notifications.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.prisma.notifications.findUnique({ where: { id } });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notifications.update({
      where: { id },
      data: updateNotificationDto,
    });
  }

  async remove(id: string) {
    const notification = await this.prisma.notifications.findUnique({ where: { id } });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notifications.delete({ where: { id } });
  }
}


