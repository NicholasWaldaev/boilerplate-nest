import { Module } from '@nestjs/common';
import { PermissionForRolesService } from '@/internal/permission/services/permissionForRoles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '@internal/permission/permission.entity';
import { PermissionRepository } from '@internal/permission/permission.repository';
import { PermissionController } from '@internal/permission/permission.controller';
import { PermissionForClientService } from '@internal/permission/services/permissionForClient.service';
import { PermissionForSeedService } from '@internal/permission/services/permissionForSeed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  controllers: [PermissionController],
  providers: [
    PermissionForRolesService,
    PermissionRepository,
    PermissionForClientService,
    PermissionForSeedService,
  ],
  exports: [PermissionForRolesService, PermissionForSeedService],
})
export class PermissionModule {}
