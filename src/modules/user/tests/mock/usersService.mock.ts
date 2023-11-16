import { UpdateUserDto } from '@modules/user/dto/update-user.dto';
import { mockUsers } from '@modules/user/tests/mock/users.mock';
import { User } from '@modules/user/user.entity';
import { mockPageUsersDto } from '@modules/user/tests/mock/pageUsers.mock';

export const mockUsersService = {
  createUser: jest.fn(() => ({
    id: String(Date.now()),
    ...mockUsers[0],
  })),
  updateUser: jest.fn((id: string, dto: UpdateUserDto) => ({
    id,
    ...mockUsers[0],
    ...dto,
  })),
  delete: jest.fn(() => ({})),
  getById: jest.fn((id: string) =>
    mockUsers.find((user: User) => user.id === id),
  ),
  findAll: jest.fn(() => mockPageUsersDto),
};
