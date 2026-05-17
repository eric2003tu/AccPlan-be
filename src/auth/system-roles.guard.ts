import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SYSTEM_ROLES_KEY } from './system-roles.decorator';

@Injectable()
export class SystemRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(SYSTEM_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as any;

    if (!user || !user.id) {
      throw new UnauthorizedException('Authentication required');
    }

    // Expect `system_role` on the validated user
    const systemRole = (user.system_role ?? 'NORMAL') as string;

    if (requiredRoles.includes(systemRole)) {
      return true;
    }

    throw new ForbiddenException('Insufficient system role');
  }
}
