import { Injectable, UnauthorizedException } from '@nestjs/common';
import { google, Auth } from 'googleapis';
import { UserService } from '@modules/user/user.service';
import { ConfigService } from '@nestjs/config';
import { AuthenticationService } from '@modules/authentication/authentication.service';
import { User } from '@modules/user/user.entity';

@Injectable()
export class GoogleAuthenticationService {
  oauthClient: Auth.OAuth2Client;
  constructor(
    private readonly usersService: UserService,
    private readonly configService: ConfigService,
    private readonly authenticationService: AuthenticationService,
  ) {
    const clientID = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_AUTH_CLIENT_SECRET');

    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async authenticate(token: string) {
    const tokenInfo = await this.oauthClient.getTokenInfo(token);

    const email = tokenInfo.email;

    try {
      const user = await this.usersService.getByEmail(email);

      return this.handleRegisteredUser(user);
    } catch (error) {
      if (error.status !== 404) {
        throw new error();
      }

      return this.registerUser(token, email);
    }
  }

  async registerUser(token: string, email: string) {
    const userData = await this.getUserData(token);
    const firstName = userData.given_name;
    const lastName = userData.family_name;

    const user = await this.usersService.createWithGoogle(
      email,
      firstName,
      lastName,
    );

    return this.handleRegisteredUser(user);
  }

  async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauthClient.setCredentials({
      access_token: token,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });

    return userInfoResponse.data;
  }

  async getCookiesForUser(user: User) {
    const { cookie: accessTokenCookie, token: accessToken } =
      this.authenticationService.getCookieWithJwtAccessToken(user.id);
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    return {
      accessTokenCookie,
      accessToken,
      refreshTokenCookie,
      refreshToken,
    };
  }

  async handleRegisteredUser(user: User) {
    if (!user.isRegisteredWithGoogle) {
      throw new UnauthorizedException();
    }

    const { accessTokenCookie, accessToken, refreshTokenCookie, refreshToken } =
      await this.getCookiesForUser(user);

    return {
      accessTokenCookie,
      accessToken,
      refreshTokenCookie,
      refreshToken,
      user,
    };
  }
}
