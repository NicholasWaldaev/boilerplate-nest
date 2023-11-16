import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';
import { Permission } from '@internal/permission/permission.entity';
import { Role } from '@modules/role/role.entity';
import { RolesEnum } from '@modules/role/enums/roles.enum';
import { PermissionService } from '@internal/permission/permission.service';
import { RoleService } from '@modules/role/role.service';
import { mockPermissionsRepository } from '@internal/permission/tests/mock/permissionRepository.mock';
import { createRoleDto } from '@modules/role/tests/mock/createRole.dto.mock';
import { mockRoles } from '@modules/role/tests/mock/roles.mock';
import { mockRolesRepository } from '@modules/role/tests/mock/rolesRepository.mock';
import { updateRoleDto } from '@modules/role/tests/mock/updateRole.dto.mock';
import { PaginationService } from '@/internal/pagination/pagination.service';

describe('RolesService', () => {
  let rolesService: RoleService;
  let permissionsService: PermissionService;

  const idRole = '1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(Role),
          useValue: mockRolesRepository,
        },
        PermissionService,
        {
          provide: getRepositoryToken(Permission),
          useValue: mockPermissionsRepository,
        },
        PaginationService,
      ],
    }).compile();

    rolesService = module.get<RoleService>(RoleService);
    permissionsService = module.get<PermissionService>(PermissionService);
  });

  it('should be defined', () => {
    expect(rolesService).toBeDefined();
    expect(permissionsService).toBeDefined();
  });

  it('should create a new role record and return that', async () => {
    expect(await rolesService.createRole(createRoleDto)).toEqual(
      mockRoles.find((role: Role) => role.name === createRoleDto.name),
    );
  });

  it('should update an old role record and return that', async () => {
    expect(await rolesService.updateRole(idRole, updateRoleDto)).toEqual(
      mockRoles.find((role: Role) => role.id === idRole),
    );
  });

  it('should find one by id role and return it', async () => {
    expect(await rolesService.findOne(idRole)).toEqual(
      mockRoles.find((role: Role) => role.id === idRole),
    );
  });

  it('should find one by name role and return it', async () => {
    const nameRole = RolesEnum.USER;
    expect(await rolesService.getByName(nameRole)).toEqual(
      mockRoles.find((role: Role) => role.name === nameRole),
    );
  });

  // it('should find all the roles and return them', async () => {
  //   expect(await rolesService.findAll(mockPageOptionsDto)).toEqual(
  //     mockPageRolesDto,
  //   );
  // });

  it('should delete the role by id', async () => {
    expect(await mockRolesRepository.delete(idRole)).toEqual(
      {} as DeleteResult,
    );
  });
});
