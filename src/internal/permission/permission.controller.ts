import { Controller, Get, Param } from '@nestjs/common';
import { PermissionForClientService } from '@internal/permission/services/permissionForClient.service';
import FindOneParams from '@internal/utils/findOneParams';

@Controller('permission')
export class PermissionController {
  constructor(
    private readonly permissionForClientService: PermissionForClientService,
  ) {}

  @Get()
  async findAll() {
    return await this.permissionForClientService.getAll();
  }

  @Get(':id')
  async findOne(@Param() { id }: FindOneParams) {
    return await this.permissionForClientService.getOne(id);
  }
}
