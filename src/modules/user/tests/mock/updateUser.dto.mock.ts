import { UpdateUserDto } from '@modules/user/dto/update-user.dto';
import { RolesEnum } from '@modules/role/enums/roles.enum';

export const updateUserDto: UpdateUserDto = {
  firstName: 'Bob',
  lastName: 'Bobas',
  roleName: RolesEnum.USER,
};
