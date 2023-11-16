import { UsersPermission } from '@/internal/permission/enums/usersPermissions.enum';
import { mockPermissions } from '@internal/permission/tests/mock/permissions.mock';

export const mockPermissionsRepository = {
  findBy: jest.fn().mockImplementation(() => {
    return Promise.resolve([
      {
        id: '2',
        name: UsersPermission.CREATE_USER,
      },
    ]);
  }),
  find: jest.fn().mockImplementation(() => Promise.resolve(mockPermissions)),
};
