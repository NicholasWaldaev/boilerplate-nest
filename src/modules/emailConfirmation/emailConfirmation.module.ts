import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { MailModule } from '@modules/mail/mail.module';
import { UserModule } from '@modules/user/user.module';
import { EmailConfirmationController } from '@modules/emailConfirmation/emailConfirmation.controller';
import { EmailConfirmationService } from '@modules/emailConfirmation/emailConfirmation.service';

@Module({
  imports: [ConfigModule, JwtModule, MailModule, UserModule],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
