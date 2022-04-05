import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { convertToChecksumAddress, recoverAddress } from '../utils/web3.util';
import { InvalidSignatureException } from '../exceptions/users.exceptions';

@Injectable()
export class UserSigned implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log(`User Signed`);
    const message = request.headers.msgsignature;
    const signature = request.body.signature;

    const walletAddress = convertToChecksumAddress(request.body.wallet_address, true);
    const signedAddress = recoverAddress(message, signature);
    if (walletAddress !== signedAddress) {
      throw new InvalidSignatureException();
    }
    return true;
  }
}
