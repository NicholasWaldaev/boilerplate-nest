import { UpdateRoleDto } from '@modules/role/dto/update-role.dto';
import { UsersPermission } from '@/internal/permission/enums/usersPermissions.enum';

export const updateRoleDto: UpdateRoleDto = {
  name: 'testRole',
  permissions: [UsersPermission.CREATE_USER],
};
