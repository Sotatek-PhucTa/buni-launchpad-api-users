import { CanActivate, ExecutionContext } from '@nestjs/common';
import { createHmac } from 'crypto';
import { InvalidSignatureException } from '../shares/exceptions/users.exceptions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
export class BlockPassAuth implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const body = request.body();
    const signature = request.headers['x-hub-signature'];
    const hash = createHmac('sha256', process.env.BLOCK_PASS_SECRET_KEY).update(JSON.stringify(body)).digest('hex');
    if (!signature || signature !== hash) {
      throw new InvalidSignatureException(`BlockPass auth error`);
    }
    return true;
  }
}
