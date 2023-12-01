import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission } from '@internal/permission/permission.entity';
import Permissions from '@internal/permission/types/permissions.type';

@Injectable()
export class PermissionRepository {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  getAll(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }

  getAllPermissionsByName(permissions: Permissions[]): Promise<Permission[]> {
    return this.permissionRepository.findBy({
      name: In(permissions),
    });
  }

  async getOneByName(permission: Permissions): Promise<Permission> {
    return await this.permissionRepository.findOne({
      where: { name: permission },
    });
  }

  async getOneById(id: string): Promise<Permission> {
    return await this.permissionRepository.findOne({
      where: { id },
    });
  }

  async savePermission(permission: Permissions): Promise<Permission> {
    return await this.permissionRepository.save({ name: permission });
  }
}
