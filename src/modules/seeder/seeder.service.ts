import { Injectable, Logger } from '@nestjs/common';
import { RoleService } from '@modules/role/role.service';
import { PermissionService } from '@internal/permission/permission.service';
import { UserService } from '@modules/user/user.service';

@Injectable()
export class SeederService {
  constructor(
    private readonly logger: Logger,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
    private readonly userService: UserService,
  ) {}

  async seed() {
    await this.permissions()
      .then((completed) => {
        this.logger.debug('Successfully completed seeding permissions...');
        Promise.resolve(completed);
      })
      .catch((error) => {
        this.logger.error('Failed seeding permissions...');
        Promise.reject(error);
      });

    await this.roles()
      .then((completed) => {
        this.logger.debug('Successfully completed seeding roles...');
        Promise.resolve(completed);
      })
      .catch((error) => {
        this.logger.error('Failed seeding roles...');
        Promise.reject(error);
      });

    await this.users()
      .then((completed) => {
        this.logger.debug('Successfully completed seeding administrator...');
        Promise.resolve(completed);
      })
      .catch((error) => {
        this.logger.error('Failed seeding administrator...');
        Promise.reject(error);
      });
  }

  async users() {
    return await this.userService
      .seedUser()
      .then((createdUser) => {
        this.logger.debug(
          'Created by : ' +
            [createdUser].filter(
              (nullValueOrCreatedUser) => nullValueOrCreatedUser,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch((error) => Promise.reject(error));
  }

  async roles() {
    return await Promise.all(this.roleService.seedRole())
      .then((createdRole) => {
        this.logger.debug(
          'No. of roles created : ' +
            createdRole.filter(
              (nullValueOrCreatedRole) => nullValueOrCreatedRole,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch((error) => Promise.reject(error));
  }

  async permissions() {
    return await Promise.all(this.permissionService.seedPermission())
      .then((createdPermission) => {
        this.logger.debug(
          'No. of permissions created : ' +
            createdPermission.filter(
              (nullValueOrCreatedPermission) => nullValueOrCreatedPermission,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch((error) => Promise.reject(error));
  }
}
