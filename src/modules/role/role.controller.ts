import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import FindOneParams from '@internal/utils/findOneParams';
import { CreateRoleDto } from '@modules/role/dto/create-role.dto';
import { UpdateRoleDto } from '@modules/role/dto/update-role.dto';
import { RolesPermission } from '@/internal/permission/enums/rolesPermissions.enum';
import { PermissionGuard } from '@internal/permission/guards/permission.guard';
import { RoleService } from '@modules/role/role.service';
import JwtAuthenticationGuard from '@modules/authentication/guard/jwt-authentication.guard';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@modules/role/role.entity';
import { PageDto } from '@/internal/pagination/dto/page.dto';
import { PageOptionsDto } from '@/internal/pagination/dto/page-options.dto';
@ApiTags('role')
@UseGuards(JwtAuthenticationGuard)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @UseGuards(PermissionGuard(RolesPermission.FIND_ALL_ROLES))
  findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Role> | Role[]> {
    return this.roleService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(RolesPermission.FIND_ONE_ROLE))
  findOne(@Param() { id }: FindOneParams) {
    return this.roleService.findOne(id);
  }

  @Post()
  @UseGuards(PermissionGuard(RolesPermission.CREATE_ROLE))
  async create(@Body() createRole: CreateRoleDto) {
    return await this.roleService.createRole(createRole);
  }

  @Patch(':id')
  @UseGuards(PermissionGuard(RolesPermission.UPDATE_ROLE))
  async update(
    @Param() { id }: FindOneParams,
    @Body() updateRole: UpdateRoleDto,
  ) {
    return await this.roleService.updateRole(id, updateRole);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(RolesPermission.DELETE_ROLE))
  async delete(@Param() { id }: FindOneParams) {
    return this.roleService.deleteRole(id);
  }
}
