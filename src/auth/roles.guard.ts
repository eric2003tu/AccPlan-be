import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow (this guard doesn't enforce authentication itself)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new UnauthorizedException('Authentication required');
    }

    // find business id in path, body, query or header
    const businessId =
      request.params?.businessId ||
      request.params?.business_id ||
      request.body?.business_id ||
      request.query?.businessId ||
      request.query?.business_id ||
      request.headers['x-business-id'];

    if (!businessId) {
      throw new ForbiddenException('Business context required for role check');
    }

    const bu = await this.prisma.business_users.findFirst({ where: { business_id: businessId, user_id: user.id } });

    if (!bu) {
      throw new ForbiddenException('User has no role for this business');
    }

    // role values are enums like OWNER, ADMIN, MANAGER; compare as strings
    if (requiredRoles.includes(bu.role)) {
      return true;
    }

    throw new ForbiddenException('Insufficient role');
  }
}
