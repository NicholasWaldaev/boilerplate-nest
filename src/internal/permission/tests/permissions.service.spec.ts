import { Test, TestingModule } from '@nestjs/testing';
import { PermissionService } from '@internal/permission/permission.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Permission } from '@internal/permission/permission.entity';
import { mockPermissionsRepository } from '@internal/permission/tests/mock/permissionRepository.mock';
import { mockPermissions } from '@internal/permission/tests/mock/permissions.mock';

describe('PermissionService', () => {
  let permissionsService: PermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        {
          provide: getRepositoryToken(Permission),
          useValue: mockPermissionsRepository,
        },
      ],
    }).compile();

    permissionsService = module.get<PermissionService>(PermissionService);
  });

  it('should be defined', () => {
    expect(permissionsService).toBeDefined();
  });

  it('should find all the permissions ant return them', async () => {
    expect(await permissionsService.getAll()).toEqual(mockPermissions);
  });
});
