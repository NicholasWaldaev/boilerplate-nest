import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '@/typeOrm.config';
import { UserModule } from '@modules/user/user.module';
import { SeederService } from '@modules/seeder/seeder.service';
import { RoleModule } from '@modules/role/role.module';
import { PermissionModule } from '@internal/permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true }),
    UserModule,
    RoleModule,
    PermissionModule,
  ],
  providers: [Logger, SeederService],
})
export class SeederModule {}
