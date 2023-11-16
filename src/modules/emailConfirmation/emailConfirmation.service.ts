import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import VerificationTokenPayload from '@modules/emailConfirmation/verificationTokenPayload.interface';
import { MailService } from '@modules/mail/mail.service';
import { UserService } from '@modules/user/user.service';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly usersService: UserService,
  ) {}

  public async confirmEmail(email: string) {
    const user = await this.usersService.getByEmail(email);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email is already confirmed');
    }
    await this.usersService.markEmailAsConfirmed(email);
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token is expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  public sendVerificationLink(email: string) {
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      )}`,
    });

    return this.mailService.sendConfirmEmail(email, token);
  }

  public async resendConfirmationLink(userId: string) {
    const user = await this.usersService.getById(userId);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email is already confirmed');
    }
    await this.sendVerificationLink(user.email);
  }
}
