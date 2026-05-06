import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class JournalEntriesService {
  constructor(private prisma: PrismaService) {}

  async create(createJournalEntryDto: CreateJournalEntryDto) {
    return this.prisma.journalEntries.create({
      data: {
        id: uuid(),
        ...createJournalEntryDto,
      },
      include: { lines: true },
    });
  }

  async findAll(businessId?: string, skip = 0, take = 10) {
    return this.prisma.journalEntries.findMany({
      where: businessId ? { business_id: businessId } : {},
      skip,
      take,
      include: { lines: true },
    });
  }

  async findOne(id: string) {
    const journalEntry = await this.prisma.journalEntries.findUnique({
      where: { id },
      include: { lines: true },
    });

    if (!journalEntry) {
      throw new NotFoundException('Journal entry not found');
    }

    return journalEntry;
  }

  async update(id: string, updateJournalEntryDto: UpdateJournalEntryDto) {
    const journalEntry = await this.prisma.journalEntries.findUnique({ where: { id } });

    if (!journalEntry) {
      throw new NotFoundException('Journal entry not found');
    }

    return this.prisma.journalEntries.update({
      where: { id },
      data: updateJournalEntryDto,
      include: { lines: true },
    });
  }

  async remove(id: string) {
    const journalEntry = await this.prisma.journalEntries.findUnique({ where: { id } });

    if (!journalEntry) {
      throw new NotFoundException('Journal entry not found');
    }

    return this.prisma.journalEntries.delete({
      where: { id },
      include: { lines: true },
    });
  }
}


