import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { convertToChecksumAddress, recoverAddress } from '../shares/utils/web3.util';
import { InvalidSignatureException } from '../shares/exceptions/users.exceptions';

@Injectable()
export class UserSigned implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const message = request.headers.msgsignature;
    const signature = request.body.signature;

    const walletAddress = convertToChecksumAddress(request.body.wallet_address, true);
    let signedAddress;
    try {
      signedAddress = recoverAddress(message, signature);
    } catch (e) {
      throw new InvalidSignatureException(`Invalid signature`);
    }
    if (walletAddress !== signedAddress) throw new InvalidSignatureException(`Invalid user signed`);
    return true;
  }
}
