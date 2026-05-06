import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { JournalEntriesService } from './journal-entries.service';
import { JournalEntriesController } from './journal-entries.controller';

@Module({
  imports: [PrismaModule],
  controllers: [JournalEntriesController],
  providers: [JournalEntriesService],
  exports: [JournalEntriesService],
})
export class JournalEntriesModule {}
