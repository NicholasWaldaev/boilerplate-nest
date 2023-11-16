import { HttpException, HttpStatus } from '@nestjs/common';

class UserNotFoundException extends HttpException {
  constructor(userId: string) {
    super(`User with id ${userId} not found`, HttpStatus.NOT_FOUND);
  }
}

export default UserNotFoundException;
