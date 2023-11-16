import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '@internal/bcrypt/bcrypt.service';

import { User } from '@modules/user/user.entity';
import { UserService } from '@modules/user/user.service';
import { TokenPayload } from '@modules/authentication/tokenPayload.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly bcryptService: BcryptService,
  ) {}

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.userService.getByEmail(email);
      this.verifyPassword(plainTextPassword, user.password);
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = this.bcryptService.compareTokens(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async restorePassword(user: User, password: string) {
    const hashedPasswrods = this.bcryptService.hashedValue(password);
    return await this.userService.changePassword(user.id, hashedPasswrods);
  }

  public getCookieWithJwtAccessToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: `${this.configService.get('JWT_EXPIRES_IN_ACCESS')}`,
    });
    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRES_IN_ACCESS',
    )}`;

    return {
      cookie,
      token,
    };
  }

  public getCookieWithJwtRefreshToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: `${this.configService.get('JWT_EXPIRES_IN_REFRESH')}`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/authentication/refresh; Max-Age=${this.configService.get(
      'JWT_EXPIRES_IN_REFRESH',
    )};`;

    return {
      cookie,
      token,
    };
  }

  public async getCookieWithJwtRestorePasswordToken(id: string) {
    const payload: TokenPayload = { userId: id };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_RESTORE_PASSWORD_SECRET'),
      expiresIn: `${this.configService.get('JWT_EXPIRES_IN_RESTORE_PASSWORD')}`,
    });

    const cookie = `RestorePassword=${token}; HttpOnly; Path=/authentication/restore-password; Max-Age=${this.configService.get(
      'JWT_EXPIRES_IN_RESTORE_PASSWORD',
    )}`;

    return {
      cookie,
      token,
    };
  }

  public getCookieForLogOut() {
    return [
      `Authentication=; HttpOnly; Path=/; Max-Age=0`,
      `Refresh=; HttpOnly; Path=/authentication/refresh; Max-Age=0`,
    ];
  }

  public getRestorePasswordCookieClear() {
    return [
      `RestorePassword=; HttpOnly; Path=/authentication/restore-password; Max-Age=0`,
    ];
  }
}
