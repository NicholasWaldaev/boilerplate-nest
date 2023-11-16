import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ErrorMessageForAuthorization } from '@modules/authentication/enum/errorMessageForAuthorization.enum';
import { RegexpMatchForAuthorization } from '@modules/authentication/regexpMatchForAuthorization.class';

export class RegistrationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(24)
  @Matches(RegexpMatchForAuthorization.ONLY_LETTERS_DASHES_SPACES, {
    message: ErrorMessageForAuthorization.FIRST_NAME,
  })
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(24)
  @Matches(RegexpMatchForAuthorization.ONLY_LETTERS_DASHES_SPACES, {
    message: ErrorMessageForAuthorization.LAST_NAME,
  })
  lastName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

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
