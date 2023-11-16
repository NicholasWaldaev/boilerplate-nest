import { IsNotEmpty, IsString } from 'class-validator';

export class TokentVerificationDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
