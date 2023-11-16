import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { TokentVerificationDto } from '@modules/socialAuthentication/tokenVerification.dto';
import { GoogleAuthenticationService } from '@modules/socialAuthentication/services/googleAuthentication.service';
import { getValueFromString } from '@/internal/utils/getUniqueTokenValue';
import { RedisService } from '@/internal/redis/redis.service';

@Controller('social_authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class SocialAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
    private readonly redisService: RedisService,
  ) {}

  @Post()
  async authentication(
    @Body() tokenData: TokentVerificationDto,
    @Req() request: Request,
  ) {
    const { ip } = request;

    const {
      accessTokenCookie,
      accessToken,
      refreshTokenCookie,
      refreshToken,
      user,
    } = await this.googleAuthenticationService.authenticate(tokenData.token);

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
  }
}
