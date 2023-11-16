import { Module } from '@nestjs/common';
import { SocialAuthenticationController } from '@modules/socialAuthentication/socialAuthentication.controller';
import { GoogleAuthenticationService } from '@modules/socialAuthentication/services/googleAuthentication.service';
import { UserModule } from '@modules/user/user.module';
import { AuthenticationModule } from '@modules/authentication/authentication.module';
import { RedisModule } from '@/internal/redis/redis.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, AuthenticationModule, RedisModule, ConfigModule],
  controllers: [SocialAuthenticationController],
  providers: [GoogleAuthenticationService],
})
export class SocialAuthenticationModule {}
