import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { RedisService } from '@internal/redis/redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BcryptModule } from '@internal/bcrypt/bcrypt.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        auth_pass: configService.get('REDIS_PASSWORD'),
      }),
      inject: [ConfigService],
    }),
    BcryptModule,
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
