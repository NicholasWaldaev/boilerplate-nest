import { HttpException, HttpStatus } from '@nestjs/common';

class RoleNotFoundException extends HttpException {
  constructor(roleId: string) {
    super(`Role with id ${roleId} not found`, HttpStatus.NOT_FOUND);
  }
}

export default RoleNotFoundException;
