import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { MailService } from '@modules/mail/mail.service';
import { EmailConfirmationGuard } from '@modules/emailConfirmation/emailConfirmation.guard';
import { EmailConfirmationService } from '@modules/emailConfirmation/emailConfirmation.service';
import { UserService } from '@modules/user/user.service';
import { AuthenticationService } from '@modules/authentication/authentication.service';
import { RegistrationDto } from '@modules/authentication/dto/registration.dto';
import { RequestRestorePasswordDto } from '@modules/authentication/dto/request-restore-password.dto';
import { RestorePasswordDto } from '@modules/authentication/dto/restore-password.dto';
import JwtAuthenticationGuard from '@modules/authentication/guard/jwt-authentication.guard';
import JwtRefreshGuard from '@modules/authentication/guard/jwt-refresh.guard';
import JwtRestorePasswordGuard from '@modules/authentication/guard/jwt-restore-password.guard';
import { LocalAuthenticationGuard } from '@modules/authentication/guard/localAuthentication.guard';
import RequestWithUser from '@modules/authentication/requestWithUser.interface';
import { RolesEnum } from '@modules/role/enums/roles.enum';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LogInDto } from '@modules/authentication/dto/log-in.swagger.dto';
import { RedisService } from '@internal/redis/redis.service';
import { getValueFromString } from '@internal/utils/getUniqueTokenValue';

@ApiTags('authentication')
@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly redisService: RedisService,
  ) {}

  @Post('registration')
  async registration(@Body() registrationData: RegistrationDto) {
    const user = await this.userService.createUser({
      ...registrationData,
      roleName: RolesEnum.USER,
    });

    this.emailConfirmationService.sendVerificationLink(registrationData.email);

    return await this.userService.getById(user.id);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  @ApiBody({ type: LogInDto })
  async logIn(@Req() request: RequestWithUser) {
    const { user, ip } = request;

    const { cookie: accessTokenCookie, token: accessToken } =
      this.authenticationService.getCookieWithJwtAccessToken(user.id);
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    await this.redisService.storeRecord(
      `${user.id}access`,
      getValueFromString(accessToken),
    );
    await this.redisService.storeRecord(
      `${user.id}refresh`,
      getValueFromString(refreshToken),
    );
    await this.redisService.storeRecord(
      `${user.id}ip`,
      getValueFromString(ip, true),
    );

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    return user;
  }

  @UseGuards(EmailConfirmationGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    const { user } = request;
    this.redisService.dropRecord(`${user.id}access`);
    this.redisService.dropRecord(`${user.id}refresh`);
    this.redisService.dropRecord(`${user.id}ip`);

    request.res.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() request: RequestWithUser) {
    const { user } = request;
    const { cookie: accessTokenCookie, token: accessToken } =
      this.authenticationService.getCookieWithJwtAccessToken(user.id);

    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    await this.redisService.storeRecord(
      `${user.id}access`,
      getValueFromString(accessToken),
    );
    await this.redisService.storeRecord(
      `${user.id}refresh`,
      getValueFromString(refreshToken),
    );

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    return user;
  }

  @Post('restore-password-request')
  async requestRestorePassword(
    @Body() requestRestorePassword: RequestRestorePasswordDto,
    @Req() request: RequestWithUser,
  ) {
    const { email } = requestRestorePassword;
    const user = await this.userService.getByEmail(email);
    const { cookie: resetPasswordTokenCookie, token: resetPasswordToken } =
      await this.authenticationService.getCookieWithJwtRestorePasswordToken(
        user.id,
      );

    await this.redisService.storeRecord(
      `${user.id}resetPassword`,
      getValueFromString(resetPasswordToken),
    );

    this.mailService.send(email, resetPasswordToken);

    request.res.setHeader('Set-Cookie', resetPasswordTokenCookie);
  }

  @UseGuards(JwtRestorePasswordGuard)
  @Post('restore-password')
  async restorePassword(
    @Req() request: RequestWithUser,
    @Body() restorePassword: RestorePasswordDto,
  ) {
    const { user } = request;
    await this.authenticationService.restorePassword(
      user,
      restorePassword.password,
    );
    this.redisService.dropRecord(`${user.id}resetPassword`);

    request.res.setHeader(
      'Set-Cookie',
      this.authenticationService.getRestorePasswordCookieClear(),
    );
  }
}
