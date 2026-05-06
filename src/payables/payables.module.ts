import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PayablesService } from './payables.service';
import { PayablesController } from './payables.controller';

@Module({
  imports: [PrismaModule],
  controllers: [PayablesController],
  providers: [PayablesService],
  exports: [PayablesService],
})
export class PayablesModule {}
