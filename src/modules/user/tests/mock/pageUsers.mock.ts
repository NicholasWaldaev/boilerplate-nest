import { PageMetaDto } from '@internal/pagination/dto/page-meta.dto';
import { PageDto } from '@internal/pagination/dto/page.dto';
import { mockUsers } from '@modules/user/tests/mock/users.mock';
import { mockPageOptionsDto } from '@modules/user/tests/mock/pageOptions.dto.mock';
import { User } from '@modules/user/user.entity';

export const mockPageUsersDto: PageDto<User> = {
  data: mockUsers,
  meta: new PageMetaDto({
    pageOptions: mockPageOptionsDto,
    itemCount: mockUsers.length,
  }),
};
