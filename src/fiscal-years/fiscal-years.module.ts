import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FiscalYearsService } from './fiscal-years.service';
import { FiscalYearsController } from './fiscal-years.controller';

@Module({
  imports: [PrismaModule],
  controllers: [FiscalYearsController],
  providers: [FiscalYearsService],
  exports: [FiscalYearsService],
})
export class FiscalYearsModule {}
