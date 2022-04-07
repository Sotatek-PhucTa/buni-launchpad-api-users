import { BaseException } from './base.exceptions';
import { HttpStatus } from '@nestjs/common';

export class AddressMustNotBeEmptyException extends BaseException {
  constructor() {
    super(`Address must not be empty`, HttpStatus.BAD_REQUEST);
  }
}

export class AddressMustHaveTheRightFormatException extends BaseException {
  constructor(address: string) {
    super(`Address ${address} is not in the right format`, HttpStatus.BAD_REQUEST);
  }
}

export class InvalidSignatureException extends BaseException {
  constructor(msg: string) {
    super(msg, HttpStatus.BAD_REQUEST);
  }
}

export class JwtTokenInvalidException extends BaseException {
  constructor() {
    super(`Jwt token invalid`, HttpStatus.UNAUTHORIZED);
  }
}

export class VerifyEtherSignatureInvalidException extends BaseException {
  constructor() {
    super('Verify ether signature invalid', HttpStatus.UNAUTHORIZED);
  }
}

export class UserNotFoundException extends BaseException {
  constructor(userAddress: string) {
    super(`Not found user ${userAddress}`, HttpStatus.BAD_REQUEST);
  }
}
