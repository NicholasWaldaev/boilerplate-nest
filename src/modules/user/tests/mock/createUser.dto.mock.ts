import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { RolesEnum } from '@modules/role/enums/roles.enum';

export const createUserDto: CreateUserDto = {
  firstName: 'Admin',
  lastName: 'Admin',
  password: '12345',
  email: 'admin@admin.com',
  roleName: RolesEnum.USER,
};
