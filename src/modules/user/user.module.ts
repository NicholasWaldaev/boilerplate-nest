import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaginationModule } from '@/internal/pagination/pagination.module';
import { BcryptModule } from '@internal/bcrypt/bcrypt.module';
import { Permission } from '@internal/permission/permission.entity';
import { RedisModule } from '@internal/redis/redis.module';
import { UserController } from '@modules/user/user.controller';
import { User } from '@modules/user/user.entity';
import { UserService } from '@modules/user/user.service';
import { PermissionModule } from '@internal/permission/permission.module';
import { RoleModule } from '@modules/role/role.module';
import { MinioClientModule } from '@/internal/minioClient/minioClient.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission, User]),
    ConfigModule,
    BcryptModule,
    RedisModule,
    RoleModule,
    PermissionModule,
    PaginationModule,
    MinioClientModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
