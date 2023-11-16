import { IsEnum, IsString } from 'class-validator';
import Permissions from '@internal/permission/types/permissions.type';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsEnum(Permissions, { each: true })
  permissions: Permissions[];
}
