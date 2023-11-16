import { RolesPermission } from '@/internal/permission/enums/rolesPermissions.enum';
import { UsersPermission } from '@/internal/permission/enums/usersPermissions.enum';

const Permissions = {
  ...UsersPermission,
  ...RolesPermission,
};

type Permissions = UsersPermission | RolesPermission;

export default Permissions;
