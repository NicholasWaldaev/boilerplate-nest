import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ErrorMessageForAuthorization } from '@modules/authentication/enum/errorMessageForAuthorization.enum';
import { RegexpMatchForAuthorization } from '@modules/authentication/regexpMatchForAuthorization.class';

export class RestorePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(28)
  @Matches(RegexpMatchForAuthorization.PASSWORD_PATTERN, {
    message: ErrorMessageForAuthorization.PASSWORD,
  })
  password: string;
}
