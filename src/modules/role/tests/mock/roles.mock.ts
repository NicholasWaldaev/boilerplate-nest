import { Role } from '@modules/role/role.entity';
import { UsersPermission } from '@/internal/permission/enums/usersPermissions.enum';

export const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    permissions: [
      {
        id: '2',
        name: UsersPermission.CREATE_USER,
      },
    ],
  },
  {
    id: '2',
    name: 'User',
    permissions: [
      {
        id: '2',
        name: UsersPermission.CREATE_USER,
      },
    ],
  },
];
