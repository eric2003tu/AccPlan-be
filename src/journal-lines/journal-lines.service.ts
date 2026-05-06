import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJournalLineDto } from './dto/create-journal-line.dto';
import { UpdateJournalLineDto } from './dto/update-journal-line.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class JournalLinesService {
  constructor(private prisma: PrismaService) {}

  async create(createJournalLineDto: CreateJournalLineDto) {
    return this.prisma.journal_lines.create({
      data: {
        id: uuid(),
        ...createJournalLineDto,
      },
    });
  }

  async findAll(journalId?: string, skip = 0, take = 10) {
    return this.prisma.journal_lines.findMany({
      where: journalId ? { journal_id: journalId } : {},
      skip,
      take,
    });
  }

  async findOne(id: string) {
    const journalLine = await this.prisma.journal_lines.findUnique({
      where: { id },
    });

    if (!journalLine) {
      throw new NotFoundException('Journal line not found');
    }

    return journalLine;
  }

  async update(id: string, updateJournalLineDto: UpdateJournalLineDto) {
    const journalLine = await this.prisma.journal_lines.findUnique({ where: { id } });

    if (!journalLine) {
      throw new NotFoundException('Journal line not found');
    }

    return this.prisma.journal_lines.update({
      where: { id },
      data: updateJournalLineDto,
    });
  }

  async remove(id: string) {
    const journalLine = await this.prisma.journal_lines.findUnique({ where: { id } });

    if (!journalLine) {
      throw new NotFoundException('Journal line not found');
    }

    return this.prisma.journal_lines.delete({ where: { id } });
  }
}


