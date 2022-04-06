import { BaseException } from './base.exceptions';
import { HttpStatus } from '@nestjs/common';

export class BlockPassApiFailedException extends BaseException {
  constructor(recordId: string) {
    super(`BlockPass get status of record ${recordId} failed exception`, HttpStatus.BAD_REQUEST);
  }
}
