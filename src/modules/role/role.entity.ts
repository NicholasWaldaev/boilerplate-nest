import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Permission } from '@internal/permission/permission.entity';
@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Permission, (permission) => permission.id, {
    cascade: ['soft-remove'],
    onUpdate: 'NO ACTION',
    nullable: true,
  })
  @JoinTable({
    name: 'roles_permissions_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];
}
