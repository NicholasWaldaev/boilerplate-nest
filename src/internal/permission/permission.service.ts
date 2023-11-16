import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission } from '@internal/permission/permission.entity';
import Permissions from '@internal/permission/types/permissions.type';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  getAll() {
    return this.permissionRepository.find();
  }

  getAllPermissionsByName(permissions: Permissions[]) {
    return this.permissionRepository.findBy({
      name: In(permissions),
    });
  }

  seedPermission(): Array<Promise<Permission>> {
    return Object.values(Permissions).map(async (permission: Permissions) => {
      return await this.permissionRepository
        .findOne({ where: { name: permission } })
        .then(async (dbConsultation) => {
          if (dbConsultation) {
            return Promise.resolve(null);
          }
          return Promise.resolve(
            await this.permissionRepository.save({ name: permission }),
          );
        })
        .catch((error) => Promise.reject(error));
    });
  }
}
