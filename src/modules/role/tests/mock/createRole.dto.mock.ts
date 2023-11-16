import { CreateRoleDto } from '@modules/role/dto/create-role.dto';
import { UsersPermission } from '@/internal/permission/enums/usersPermissions.enum';

export const createRoleDto: CreateRoleDto = {
  name: 'Admin',
  permissions: [UsersPermission.CREATE_USER],
};
