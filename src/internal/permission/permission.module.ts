import { Module } from '@nestjs/common';
import { PermissionService } from '@internal/permission/permission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '@internal/permission/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
