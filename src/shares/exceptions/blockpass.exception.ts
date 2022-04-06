import { BaseException } from './base.exceptions';
import { HttpStatus } from '@nestjs/common';

export class BlockPassApiFailedException extends BaseException {
  constructor(recordId: string) {
    super(`BlockPass get status of record ${recordId} failed exception`, HttpStatus.BAD_REQUEST);
  }
}

export class BlockPassResponseDoesNotHaveRequiredValueException extends BaseException {
  constructor(recordId: string, field: string) {
    super(`BlockPass ${recordId} does not have ${field.toUpperCase()}`, HttpStatus.BAD_REQUEST);
  }
}
