import { BaseException } from './base.exceptions';
import { HttpStatus } from '@nestjs/common';

export class AddressMustNotBeEmptyException extends BaseException {
  constructor() {
    super(`Address must not be empty`, HttpStatus.BAD_REQUEST);
  }
}

export class AddressMustHaveTheRightFormat extends BaseException {
  constructor(address: string) {
    super(`Address ${address} is not in the right format`, HttpStatus.BAD_REQUEST);
  }
}
