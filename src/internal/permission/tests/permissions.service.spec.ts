import { Test, TestingModule } from '@nestjs/testing';
import { PermissionForRolesService } from '@/internal/permission/services/permissionForRoles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Permission } from '@internal/permission/permission.entity';
import { mockPermissionsRepository } from '@internal/permission/tests/mock/permissionRepository.mock';
import { mockPermissions } from '@internal/permission/tests/mock/permissions.mock';

describe('PermissionService', () => {
  let permissionsService: PermissionForRolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionForRolesService,
        {
          provide: getRepositoryToken(Permission),
          useValue: mockPermissionsRepository,
        },
      ],
    }).compile();

    permissionsService = module.get<PermissionForRolesService>(
      PermissionForRolesService,
    );
  });

  it('should be defined', () => {
    expect(permissionsService).toBeDefined();
  });

  it('should find all the permissions ant return them', async () => {
    expect(await permissionsService.getAll()).toEqual(mockPermissions);
  });
});
