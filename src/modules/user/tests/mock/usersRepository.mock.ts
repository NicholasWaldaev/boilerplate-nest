import { User } from '@modules/user/user.entity';
import { mockUsers } from '@modules/user/tests/mock/users.mock';
import { DeleteResult } from 'typeorm';

export const mockUsersRepository = {
  create: jest.fn().mockImplementation(() => mockUsers[0]),
  save: jest.fn().mockImplementation(() => Promise.resolve(mockUsers[0])),
  findOne: jest
    .fn()
    .mockImplementation(() =>
      Promise.resolve(mockUsers.find((user: User) => user.id === '1')),
    ),
  findOneBy: jest
    .fn()
    .mockImplementation(() =>
      Promise.resolve(
        mockUsers.find((user: User) => user.email === 'admin@admin.com'),
      ),
    ),
  find: jest.fn().mockImplementation(() => Promise.resolve(mockUsers)),
  findAndCount: jest
    .fn()
    .mockImplementation(() => Promise.resolve([mockUsers, mockUsers.length])),
  delete: jest
    .fn()
    .mockImplementation(() => Promise.resolve({} as DeleteResult)),
};
