import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { BcryptService } from '@internal/bcrypt/bcrypt.service';
import { Repository } from 'typeorm';

import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { UpdateUserDto } from '@modules/user/dto/update-user.dto';
import { User } from '@modules/user/user.entity';
import { RolesEnum } from '@modules/role/enums/roles.enum';
import UserNotFoundException from '@modules/user/exception/userNotFound';
import { RoleService } from '@modules/role/role.service';
import { RedisService } from '@internal/redis/redis.service';
import { getValueFromString } from '@internal/utils/getUniqueTokenValue';
import { PageOptionsDto } from '@/internal/pagination/dto/page-options.dto';
import { PageDto } from '@/internal/pagination/dto/page.dto';
import { PaginationService } from '@/internal/pagination/pagination.service';
import { BufferedFile } from '@/internal/minioClient/file.model';
import { ImageProccessingService } from '@/internal/minioClient/services/imageProcessing.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly roleService: RoleService,
    private readonly bcryptService: BcryptService,
    private readonly redisService: RedisService,
    private readonly paginationService: PaginationService,
    private readonly imageProcessingService: ImageProccessingService,
  ) {}

  async findAll(
    pageOptionsDto?: PageOptionsDto,
  ): Promise<PageDto<User> | User[]> {
    return await this.paginationService.findAll(User, pageOptionsDto);
  }

  async createUser(createUserDto: CreateUserDto) {
    const { password, roleName, ...restCreateUserDto } = createUserDto;

    const role = await this.roleService.getByName(roleName);

    const hashedPassword = this.bcryptService.hashedValue(password);

    try {
      const newUser = await this.userRepository.create({
        ...restCreateUserDto,
        password: hashedPassword,
        roles: [role],
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'A user with such an email address already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(id: string, updateUser: UpdateUserDto) {
    const user = await this.getById(id);
    const { roleName, ...restUpdateUser } = updateUser;

    if (roleName) {
      const role = await this.roleService.getByName(roleName);
      user.roles = [role];
    }

    const updatedUserData = {
      ...user,
      ...restUpdateUser,
    };

    return await this.userRepository.save(updatedUserData);
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email: email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        roles: {
          permissions: true,
        },
      },
      withDeleted: true,
    });

    if (user) {
      return user;
    }

    throw new UserNotFoundException(id);
  }

  async getUserIfTokenAndIPMaches(
    token: string,
    userId: string,
    ip: string,
    key: string,
    kyeIP: string,
  ) {
    const hashedUniqueUserToken = await this.redisService.readRecord(key);
    const hashedUserIP = await this.redisService.readRecord(kyeIP);

    const uniqueToken = getValueFromString(token);
    const userIP = getValueFromString(ip, true);

    const isTokenMatching = this.bcryptService.compareTokens(
      uniqueToken,
      hashedUniqueUserToken as string,
    );
    const isIPMatching = this.bcryptService.compareTokens(
      userIP,
      hashedUserIP as string,
    );

    if (isTokenMatching && isIPMatching) {
      return await this.getById(userId);
    }
  }

  async changePassword(userId: string, hashedPassword: string) {
    return await this.userRepository.update(
      { id: userId },
      {
        password: hashedPassword,
      },
    );
  }

  async markEmailAsConfirmed(email: string) {
    return this.userRepository.update(
      { email },
      {
        isEmailConfirmed: true,
      },
    );
  }

  async createWithGoogle(email: string, firstName: string, lastName: string) {
    const newUser = await this.userRepository.create({
      email,
      firstName,
      lastName,
      isRegisteredWithGoogle: true,
    });

    await this.userRepository.save(newUser);
    return newUser;
  }

  async setRegisteredWithGoogle(email: string) {
    await this.userRepository.update(
      { email },
      {
        isRegisteredWithGoogle: true,
      },
    );
  }

  async delete(id: string) {
    const deleteResponse = await this.userRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new UserNotFoundException(id);
    }
  }

  async restoreDeletedUser(id: string) {
    const restoreResponse = await this.userRepository.restore(id);
    if (!restoreResponse.affected) {
      throw new UserNotFoundException(id);
    }
  }

  async uploadImage(image: BufferedFile, user: User) {
    const { id, avatarUrl } = user;

    if (avatarUrl) {
      this.imageProcessingService.removeObject(id, avatarUrl);
    }

    const uploaded_image = await this.imageProcessingService.uploadImage(
      image,
      id,
    );

    await this.userRepository.update(id, {
      avatarUrl: uploaded_image.url,
    });

    return {
      image_url: uploaded_image.url,
      message: 'Image upload successful',
    };
  }

  async seedUser(): Promise<User> {
    return await this.userRepository
      .findOneBy({ email: this.configService.get('ADMIN_EMAIL') })
      .then(async (dbAdmin) => {
        if (dbAdmin) {
          return Promise.resolve(null);
        }
        const adminRole = await this.roleService.getByName(RolesEnum.ADMIN);
        const hashedPasswrods = this.bcryptService.hashedValue(
          this.configService.get('ADMIN_PASSWORD'),
        );
        return Promise.resolve(
          await this.userRepository.save({
            firstName: this.configService.get('ADMIN_FIRST_NAME'),
            lastName: this.configService.get('ADMIN_LAST_NAME'),
            email: this.configService.get('ADMIN_EMAIL'),
            isEmailConfirmed: true,
            password: hashedPasswrods,
            roles: [adminRole],
          }),
        );
      })
      .catch((error) => Promise.reject(error));
  }
}
