import { PageMetaDto } from '@internal/pagination/dto/page-meta.dto';
import { PageDto } from '@internal/pagination/dto/page.dto';
import { mockPageOptionsDto } from '@modules/user/tests/mock/pageOptions.dto.mock';
import { Role } from '@modules/role/role.entity';
import { mockRoles } from '@modules/role/tests/mock/roles.mock';

export const mockPageRolesDto: PageDto<Role> = {
  data: mockRoles,
  meta: new PageMetaDto({
    pageOptions: mockPageOptionsDto,
    itemCount: mockRoles.length,
  }),
};
