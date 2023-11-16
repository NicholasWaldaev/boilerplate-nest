import { Module } from '@nestjs/common';
import { BcryptService } from '@internal/bcrypt/bcrypt.service';

@Module({
  providers: [BcryptService],
  exports: [BcryptService],
})
export class BcryptModule {}
