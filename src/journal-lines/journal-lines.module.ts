import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { JournalLinesService } from './journal-lines.service';
import { JournalLinesController } from './journal-lines.controller';

@Module({
  imports: [PrismaModule],
  controllers: [JournalLinesController],
  providers: [JournalLinesService],
  exports: [JournalLinesService],
})
export class JournalLinesModule {}
