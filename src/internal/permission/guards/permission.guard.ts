import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import JwtAuthenticationGuard from '@modules/authentication/guard/jwt-authentication.guard';
import RequestWithUser from '@modules/authentication/requestWithUser.interface';
import Permissions from '@internal/permission/types/permissions.type';

export const PermissionGuard = (permission: Permissions): Type<CanActivate> => {
  class PermissionGuardMixin extends JwtAuthenticationGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      return user?.roles.some((role) =>
        role.permissions.some((perm) => perm.name === permission),
      );
    }
  }

  return mixin(PermissionGuardMixin);
};
