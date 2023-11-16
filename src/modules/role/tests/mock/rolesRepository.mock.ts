import { Role } from '@modules/role/role.entity';
import { mockRoles } from '@modules/role/tests/mock/roles.mock';
import { DeleteResult } from 'typeorm';

export const mockRolesRepository = {
  create: jest.fn().mockImplementation(() => mockRoles[0]),
  save: jest
    .fn()
    .mockImplementation((role) => Promise.resolve({ id: '2', ...role })),
  findOne: jest
    .fn()
    .mockImplementation(() =>
      Promise.resolve(mockRoles.find((role: Role) => role.id === '1')),
    ),
  find: jest.fn().mockImplementation(() => Promise.resolve(mockRoles)),
  findAndCount: jest
    .fn()
    .mockImplementation(() => Promise.resolve([mockRoles, mockRoles.length])),
  findOneBy: jest
    .fn()
    .mockImplementation(() =>
      Promise.resolve(mockRoles.find((role: Role) => role.name === 'User')),
    ),
  delete: jest
    .fn()
    .mockImplementation(() => Promise.resolve({} as DeleteResult)),
};
