import { CreateRoleDto } from '@modules/role/dto/create-role.dto';
import { UpdateRoleDto } from '@modules/role/dto/update-role.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PageOptionsDto } from '@/internal/pagination/dto/page-options.dto';
import { PageDto } from '@/internal/pagination/dto/page.dto';
import { PaginationService } from '@/internal/pagination/pagination.service';
import { PermissionForRolesService } from '@/internal/permission/services/permissionForRoles.service';
import { RolesEnum } from '@modules/role/enums/roles.enum';
import RoleNotFoundException from '@/modules/role/exception/roleNotFound';
import { Role } from '@modules/role/role.entity';
import Roles from '@modules/role/types/roles.type';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly permissionService: PermissionForRolesService,
    private readonly paginationService: PaginationService,
  ) {}

  async findAll(
    pageOptionsDto?: PageOptionsDto,
  ): Promise<PageDto<Role> | Role[]> {
    return await this.paginationService.findAll(Role, pageOptionsDto);
  }

  async findOne(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      throw new RoleNotFoundException(id);
    }

    return role;
  }

  async getByName(name: RolesEnum) {
    const role = await this.roleRepository.findOneBy({ name });
    if (role) {
      return role;
    }
    throw new HttpException(
      `A role with this ${name} does not exist`,
      HttpStatus.NOT_FOUND,
    );
  }

  async createRole(createRole: CreateRoleDto) {
    const permissions = await this.permissionService.getAllPermissionsByName(
      createRole.permissions,
    );

    const newRole = await this.roleRepository.create({
      name: createRole.name,
      permissions: [...permissions],
    });
    return await this.roleRepository.save(newRole);
  }

  async updateRole(id: string, updateRole: UpdateRoleDto) {
    const role = await this.findOne(id);

    if (updateRole.permissions && updateRole.permissions.length > 0) {
      const permissions = await this.permissionService.getAllPermissionsByName(
        updateRole.permissions,
      );
      role.permissions = [...permissions];
    }

    role.name = updateRole.name;

    return await this.roleRepository.save(role);
  }

  async deleteRole(id: string) {
    const deleteResponse = await this.roleRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new RoleNotFoundException(id);
    }
  }

  seedRole(): Array<Promise<Role>> {
    return Object.values(Roles).map(async (role: Roles) => {
      return await this.roleRepository
        .findOne({ where: { name: role } })
        .then(async (dbConsultation) => {
          if (dbConsultation) {
            return Promise.resolve(null);
          }
          const permissions = await this.permissionService.getAll();
          return Promise.resolve(
            await this.roleRepository.save({
              name: role,
              permissions: role === Roles.ADMIN ? [...permissions] : null,
            }),
          );
        })
        .catch((error) => Promise.reject(error));
    });
  }
}
