import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IUserCtx } from '../interfaces/user-ctx.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(protected readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();

    const user: IUserCtx = request.user;

    if (!user) return false;

    if (request.method === 'DELETE' && user.role !== 'admin') {
      return false;
    }

    if (!roles || user.role === 'admin') {
      return true;
    }

    if (request.params._id && request.params._id === user._id) {
      return true;
    }

    return this.hasRole(user.role, roles);
  }

  private hasRole(userRole: string, permissionRole: any): boolean {
    const check = permissionRole.find(role => userRole === role);
    if (check) return true;
    return false;
  }
}
