import { Test } from '@nestjs/testing';
import { UserController } from '@modules/user/user.controller';
import { User } from '@modules/user/user.entity';
import { UserService } from '@modules/user/user.service';
import { createUserDto } from '@modules/user/tests/mock/createUser.dto.mock';
import { updateUserDto } from '@modules/user/tests/mock/updateUser.dto.mock';
import { mockUsers } from '@modules/user/tests/mock/users.mock';
import { mockUsersService } from '@modules/user/tests/mock/usersService.mock';
import { mockPageOptionsDto } from '@modules/user/tests/mock/pageOptions.dto.mock';
import { mockPageUsersDto } from '@modules/user/tests/mock/pageUsers.mock';

describe('UsersController', () => {
  let usersController: UserController;

  const params = { id: '1' };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUsersService)
      .compile();

    usersController = moduleRef.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should create a user', async () => {
    expect(await usersController.createUser(createUserDto)).toEqual(
      mockUsers[0],
    );
    expect(mockUsersService.createUser).toHaveBeenCalledWith(createUserDto);
  });

  it('should update a user', async () => {
    const user = {
      ...mockUsers[0],
      ...updateUserDto,
    };

    expect(await usersController.update(params, updateUserDto)).toEqual(user);
    expect(mockUsersService.updateUser).toHaveBeenCalledWith(
      params.id,
      updateUserDto,
    );
  });

  it('should delete a user', async () => {
    expect(usersController.remove(params)).toEqual({});
    expect(mockUsersService.delete).toHaveBeenLastCalledWith(params.id);
  });

  it('one role should be found', () => {
    expect(usersController.findOne(params)).toEqual(
      mockUsers.find((user: User) => user.id === params.id),
    );
    expect(mockUsersService.getById).toHaveBeenCalledWith(params.id);
  });

  it('find all users', () => {
    expect(usersController.findAll(mockPageOptionsDto)).toEqual(
      mockPageUsersDto,
    );
    expect(mockUsersService.findAll).toHaveBeenCalledWith(mockPageOptionsDto);
  });
});
