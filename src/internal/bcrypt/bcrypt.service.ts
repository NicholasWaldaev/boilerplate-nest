import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BcryptService {
  hashedValue(value: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(value, salt);
  }

  compareTokens(valueBeingChecked: string, valueToCheck: string) {
    const isTokenMatching = bcrypt.compareSync(valueBeingChecked, valueToCheck);

    if (!isTokenMatching) {
      new BadRequestException("Tokens don't match");
    }

    return isTokenMatching;
  }
}
