import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import JwtAuthenticationGuard from '@modules/authentication/guard/jwt-authentication.guard';
import RequestWithUser from '@modules/authentication/requestWithUser.interface';
import { ConfirmEmailDto } from '@modules/emailConfirmation/dto/confirmEmail.dto';
import { EmailConfirmationService } from '@modules/emailConfirmation/emailConfirmation.service';

@ApiTags('email-confirmation')
@Controller('email-confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post('confirm')
  async confirm(@Body() confirmationData: ConfirmEmailDto) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      confirmationData.token,
    );
    await this.emailConfirmationService.confirmEmail(email);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('resend-confirmation-link')
  async resendConfirmationLink(@Req() request: RequestWithUser) {
    await this.emailConfirmationService.resendConfirmationLink(request.user.id);
  }
}
