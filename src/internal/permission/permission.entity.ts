import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import Permissions from '@internal/permission/types/permissions.type';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: Permissions,
    unique: true,
  })
  name: Permissions;
}
