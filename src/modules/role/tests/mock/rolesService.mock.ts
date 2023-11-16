import { UpdateRoleDto } from '@modules/role/dto/update-role.dto';
import { mockRoles } from '@modules/role/tests/mock/roles.mock';
import { Role } from '@modules/role/role.entity';
import { mockPageRolesDto } from '@modules/role/tests/mock/pageRoles.dto.mock';

export const mockRolesService = {
  createRole: jest.fn(() => mockRoles[0]),
  updateRole: jest.fn((id: string, dto: UpdateRoleDto) => ({
    id,
    ...mockRoles[0],
    ...dto,
  })),
  deleteRole: jest.fn(() => ({})),
  findOne: jest.fn((id: string) => {
    return mockRoles.find((role: Role) => role.id === id);
  }),
  findAll: jest.fn(() => {
    return mockPageRolesDto;
  }),
};
