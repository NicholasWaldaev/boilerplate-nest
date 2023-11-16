import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { BcryptService } from '@internal/bcrypt/bcrypt.service';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly bcryptService: BcryptService,
  ) {}

  async storeRecord(key: string, value: string, ttl?: number) {
    const hashValue = this.bcryptService.hashedValue(value);
    if (ttl) {
      await this.cache.set(key, hashValue);
    } else {
      await this.cache.set(key, hashValue);
    }
  }

  async dropRecord(key: string) {
    await this.cache.del(key);
  }

  async readRecord(key: string) {
    const value = await this.cache.get(key);
    if (!value) {
      throw new NotFoundException();
    }
    return value;
  }
}
