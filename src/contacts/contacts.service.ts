import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    return this.prisma.contacts.create({
      data: {
        id: uuid(),
        ...createContactDto,
      },
    });
  }

  async findAll(businessId?: string, skip = 0, take = 10) {
    return this.prisma.contacts.findMany({
      where: businessId ? { business_id: businessId } : {},
      skip,
      take,
    });
  }

  async findOne(id: string) {
    const contact = await this.prisma.contacts.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return contact;
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    const contact = await this.prisma.contacts.findUnique({ where: { id } });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return this.prisma.contacts.update({
      where: { id },
      data: updateContactDto,
    });
  }

  async remove(id: string) {
    const contact = await this.prisma.contacts.findUnique({ where: { id } });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return this.prisma.contacts.delete({ where: { id } });
  }
}


