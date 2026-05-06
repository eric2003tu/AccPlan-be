import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BusinessUsersService } from './business-users.service';
import { BusinessUsersController } from './business-users.controller';

@Module({
  imports: [PrismaModule],
  controllers: [BusinessUsersController],
  providers: [BusinessUsersService],
  exports: [BusinessUsersService],
})
export class BusinessUsersModule {}
