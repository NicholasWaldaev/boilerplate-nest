import {
  Controller,
  Get,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Post,
  Body,
  Patch,
  Query,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import FindOneParams from '@internal/utils/findOneParams';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { UpdateUserDto } from '@modules/user/dto/update-user.dto';
import { UsersPermission } from '@/internal/permission/enums/usersPermissions.enum';
import { PermissionGuard } from '@internal/permission/guards/permission.guard';

import { UserService } from '@modules/user/user.service';
import JwtAuthenticationGuard from '@modules/authentication/guard/jwt-authentication.guard';
import { PageOptionsDto } from '@/internal/pagination/dto/page-options.dto';
import { User } from '@modules/user/user.entity';
import { PageDto } from '@/internal/pagination/dto/page.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from '@/internal/minioClient/file.model';
import RequestWithUser from '@/modules/authentication/requestWithUser.interface';

@ApiTags('user')
@UseGuards(JwtAuthenticationGuard)
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(PermissionGuard(UsersPermission.FIND_ALL_USERS))
  findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User> | User[]> {
    return this.userService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(UsersPermission.FIND_ONE_USER))
  findOne(@Param() { id }: FindOneParams) {
    return this.userService.getById(id);
  }

  @Post()
  @UseGuards(PermissionGuard(UsersPermission.CREATE_USER))
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Patch(':id')
  @UseGuards(PermissionGuard(UsersPermission.UPDATE_USER))
  async update(
    @Param() { id }: FindOneParams,
    @Body() updateUser: UpdateUserDto,
  ) {
    return await this.userService.updateUser(id, updateUser);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(UsersPermission.DELETE_USER))
  remove(@Param() { id }: FindOneParams) {
    return this.userService.delete(id);
  }

  @Patch('restore/:id')
  @UseGuards(PermissionGuard(UsersPermission.RESTORE_USER))
  restore(@Param() { id }: FindOneParams) {
    return this.userService.restoreDeletedUser(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() image: BufferedFile,
    @Req() request: RequestWithUser,
  ) {
    const { user } = request;
    return await this.userService.uploadImage(image, user);
  }
}
