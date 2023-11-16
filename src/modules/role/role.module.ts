import { Module } from '@nestjs/common';
import { RoleService } from '@modules/role/role.service';
import { RoleController } from '@modules/role/role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '@modules/role/role.entity';
import { PermissionModule } from '@internal/permission/permission.module';
import { PaginationModule } from '@/internal/pagination/pagination.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    PermissionModule,
    PaginationModule,
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
