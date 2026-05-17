import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { GlobalJwtAuthGuard } from './global-jwt-auth.guard';
import { GlobalBusinessRolesGuard } from './global-business-roles.guard';
import { SystemRolesGuard } from './system-roles.guard';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev_jwt_secret_change_me',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN ?? '1d') as any,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard, GlobalJwtAuthGuard, GlobalBusinessRolesGuard, SystemRolesGuard],
  exports: [AuthService, GlobalJwtAuthGuard, GlobalBusinessRolesGuard],
})
export class AuthModule {}
