import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { ROLES_KEY } from './roles.decorator';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class GlobalBusinessRolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Skip for public routes
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // At this point, JwtAuthGuard should have populated user. If not, let it fail at JWT layer.
    if (!user || !user.id) {
      return true; // Let JWT guard handle auth errors
    }

    // Extract business context from multiple sources
    const businessId =
      request.params?.businessId ||
      request.params?.business_id ||
      request.body?.business_id ||
      request.query?.businessId ||
      request.query?.business_id ||
      request.headers['x-business-id'];

    // If no business context is required (check if roles are defined for this handler)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If roles are defined, business context is mandatory
    if (requiredRoles && requiredRoles.length > 0) {
      if (!businessId) {
        throw new ForbiddenException('Business context required for this operation');
      }

      const bu = await this.prisma.business_users.findFirst({
        where: { business_id: businessId, user_id: user.id },
      });

      if (!bu) {
        throw new ForbiddenException('User has no role for this business');
      }

      // Check if user's role matches required roles
      if (!requiredRoles.includes(bu.role)) {
        throw new ForbiddenException('Insufficient role for this operation');
      }
    }

    return true;
  }
}
