import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { MailModule } from '@modules/mail/mail.module';
import { EmailConfirmationModule } from '@modules/emailConfirmation/emailConfirmation.module';
import { UserModule } from '@modules/user/user.module';
import { AuthenticationController } from '@modules/authentication/authentication.controller';
import { AuthenticationService } from '@modules/authentication/authentication.service';
import { JwtRefreshTokenStrategy } from '@modules/authentication/strategy/jwt-refresh-token.strategy';
import { JwtRestorePasswordStrategy } from '@modules/authentication/strategy/jwt-restore-password.strategy';
import { JwtStrategy } from '@modules/authentication/strategy/jwt.strategy';
import { LocalStrategy } from '@modules/authentication/strategy/local.strategy';
import { BcryptModule } from '@internal/bcrypt/bcrypt.module';
import { RedisModule } from '@internal/redis/redis.module';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRES_IN_ACCESS')}`,
        },
      }),
    }),
    UserModule,
    MailModule,
    EmailConfirmationModule,
    BcryptModule,
    RedisModule,
  ],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    JwtRestorePasswordStrategy,
  ],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
