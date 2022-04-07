import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { VerifyEtherSignatureInvalidException } from '../exceptions/users.exceptions';

export const UserAddress = createParamDecorator((_: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  try {
    if (request.user.address != request.user.payloadAddress) throw new VerifyEtherSignatureInvalidException();
    return request.user.address;
  } catch (e) {
    throw new HttpException(
      {
        errorCode: 'UNAUTHORIZED',
        message: 'not valid access token',
        description: 'The access token has wrong format, or invalid',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
});
