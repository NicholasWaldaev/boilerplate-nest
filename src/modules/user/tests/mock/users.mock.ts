import { UsersPermission } from '@/internal/permission/enums/usersPermissions.enum';
import { User } from '@modules/user/user.entity';
import { RolesEnum } from '@modules/role/enums/roles.enum';

export const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'Admin',
    password: '12345',
    email: 'admin@admin.com',
    isEmailConfirmed: true,
    isRegisteredWithGoogle: false,
    deletedAt: null,
    roles: [
      {
        id: '05353b1d-56c5-4a28-940e-073da40979c4',
        name: RolesEnum.ADMIN,
        permissions: [
          {
            id: '14da3da8-32d3-482d-a617-343f87c4c11c',
            name: UsersPermission.CREATE_USER,
          },
          {
            id: '17e6e68d-43b7-45ea-a24d-4ac3e3b660ff',
            name: UsersPermission.FIND_ONE_USER,
          },
          {
            id: '25f79ce0-e295-4159-8321-0a7f6787e7bd',
            name: UsersPermission.UPDATE_USER,
          },
          {
            id: '262361b6-44a5-4cdc-9b0a-ec9694890f9c',
            name: UsersPermission.DELETE_USER,
          },
        ],
      },
    ],
    avatarUrl: null,
  },
];
