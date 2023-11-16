import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '@modules/role/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column({ default: false })
  isRegisteredWithGoogle: boolean;

  @ManyToMany(() => Role, (role) => role.id, {
    cascade: ['soft-remove'],
    nullable: true,
  })
  @JoinTable({
    name: 'users_roles_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: true })
  avatarUrl: string;
}
