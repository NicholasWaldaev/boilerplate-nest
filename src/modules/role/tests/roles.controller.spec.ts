import { Test } from '@nestjs/testing';
import { RoleController } from '@modules/role/role.controller';
import { Role } from '@modules/role/role.entity';
import { RoleService } from '@modules/role/role.service';
import { createRoleDto } from '@modules/role/tests/mock/createRole.dto.mock';
import { mockRoles } from '@modules/role/tests/mock/roles.mock';
import { mockRolesService } from '@modules/role/tests/mock/rolesService.mock';
import { updateRoleDto } from '@modules/role/tests/mock/updateRole.dto.mock';
import { mockPageRolesDto } from '@modules/role/tests/mock/pageRoles.dto.mock';
import { mockPageOptionsDto } from '@/modules/user/tests/mock/pageOptions.dto.mock';

describe('RolesController', () => {
  let controller: RoleController;

  const params = { id: '1' };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [RoleService],
    })
      .overrideProvider(RoleService)
      .useValue(mockRolesService)
      .compile();

    controller = moduleRef.get<RoleController>(RoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a role', async () => {
    expect(await controller.create(createRoleDto)).toEqual(mockRoles[0]);
    expect(mockRolesService.createRole).toHaveBeenCalledWith(createRoleDto);
  });

  it('should update a role', async () => {
    const role = {
      ...mockRoles[0],
      ...updateRoleDto,
    };

    expect(await controller.update(params, updateRoleDto)).toEqual(role);
    expect(mockRolesService.updateRole).toHaveBeenCalledWith(
      params.id,
      updateRoleDto,
    );
  });

  it('should delete a role', async () => {
    expect(await controller.delete(params)).toEqual({});
    expect(mockRolesService.deleteRole).toHaveBeenCalledWith(params.id);
  });

  it('one role should be found', () => {
    expect(controller.findOne(params)).toEqual(
      mockRoles.find((role: Role) => role.id === params.id),
    );
    expect(mockRolesService.findOne).toHaveBeenCalledWith(params.id);
  });

  it('find all roles', () => {
    expect(controller.findAll(mockPageOptionsDto)).toEqual(mockPageRolesDto);
    expect(mockRolesService.findAll).toHaveBeenCalled();
  });
});
