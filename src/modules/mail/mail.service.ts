import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async send(email: string, token: string) {
    const url = `${this.configService.get(
      'FRONTEND_URL',
    )}/auth/change-password/${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      template: 'password-restore',
      context: {
        name: email,
        url,
      },
    });
  }

  async sendConfirmEmail(email: string, token: string) {
    const url = `${this.configService.get(
      'FRONTEND_URL',
    )}/auth/confirm-email/${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Email confirmation',
      template: 'confirmation-email',
      context: {
        name: email,
        url,
      },
    });
  }
}
