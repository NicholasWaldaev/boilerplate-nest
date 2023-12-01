import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PermissionRepository } from '@internal/permission/permission.repository';
import { Permission } from '@internal/permission/permission.entity';

@Injectable()
export class PermissionForClientService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  getAll(): Promise<Permission[]> {
    return this.permissionRepository.getAll();
  }

  async getOne(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.getOneById(id);

    if (permission) {
      return permission;
    }

    throw new HttpException(
      `Permission with id ${id} not found`,
      HttpStatus.NOT_FOUND,
    );
  }
}
