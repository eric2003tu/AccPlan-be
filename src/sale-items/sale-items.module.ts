import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SaleItemsService } from './sale-items.service';
import { SaleItemsController } from './sale-items.controller';

@Module({
  imports: [PrismaModule],
  controllers: [SaleItemsController],
  providers: [SaleItemsService],
  exports: [SaleItemsService],
})
export class SaleItemsModule {}
