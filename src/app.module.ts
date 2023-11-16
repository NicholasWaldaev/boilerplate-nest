import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from '@/app.controller';
import { MailModule } from '@modules/mail/mail.module';
import { dataSourceOptions } from '@/typeOrm.config';
import { SeederModule } from '@modules/seeder/seeder.module';
import { UserModule } from '@modules/user/user.module';
import { AuthenticationModule } from '@modules/authentication/authentication.module';
import { BcryptModule } from '@internal/bcrypt/bcrypt.module';
import { RedisModule } from '@internal/redis/redis.module';
import { RoleModule } from '@modules/role/role.module';
import { PermissionModule } from '@internal/permission/permission.module';
import { PaginationModule } from '@internal/pagination/pagination.module';
import { MinioClientModule } from '@internal/minioClient/minioClient.module';
import { LogsMiddleware } from '@internal/middleware/logs.middleware';
import { SocialAuthenticationModule } from '@modules/socialAuthentication/socialAuthentication.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AuthenticationModule,
    SeederModule,
    MailModule,
    BcryptModule,
    RedisModule,
    RoleModule,
    PermissionModule,
    PaginationModule,
    MinioClientModule,
    SocialAuthenticationModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
