import { Injectable } from '@nestjs/common';
import { Permission } from '@internal/permission/permission.entity';
import Permissions from '@internal/permission/types/permissions.type';
import { PermissionRepository } from '@internal/permission/permission.repository';

@Injectable()
export class PermissionForSeedService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  seedPermission(): Array<Promise<Permission>> {
    return Object.values(Permissions).map(async (permission: Permissions) => {
      return await this.permissionRepository
        .getOneByName(permission)
        .then(async (dbConsultation) => {
          if (dbConsultation) {
            return Promise.resolve(null);
          }
          return Promise.resolve(
            await this.permissionRepository.savePermission(permission),
          );
        })
        .catch((error) => Promise.reject(error));
    });
  }
}
