import { Injectable } from '@nestjs/common';
import Permissions from '@internal/permission/types/permissions.type';
import { PermissionRepository } from '@internal/permission/permission.repository';
import { Permission } from '@internal/permission/permission.entity';

@Injectable()
export class PermissionForRolesService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  getAll(): Promise<Permission[]> {
    return this.permissionRepository.getAll();
  }

  getAllPermissionsByName(permissions: Permissions[]): Promise<Permission[]> {
    return this.permissionRepository.getAllPermissionsByName(permissions);
  }
}
