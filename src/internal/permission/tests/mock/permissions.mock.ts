import { Permission } from '@internal/permission/permission.entity';
import { UsersPermission } from '@/internal/permission/enums/usersPermissions.enum';

export const mockPermissions: Permission[] = [
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
];
