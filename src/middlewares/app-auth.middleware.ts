import { Injectable, NestMiddleware } from '@nestjs/common';
import { getLogger } from '../shares/utils/cwl';
import { IPayloadJwt } from '../interfaces/jwt';
import jwtDecode from 'jwt-decode';
import { JwtTokenInvalidException } from '../shares/exceptions/users.exceptions';
import { Api as ApiAuth } from '../microservices/api-auth';

@Injectable()
export class AppAuthMiddleware implements NestMiddleware {
  private readonly logger = getLogger(AppAuthMiddleware.name);
  async use(req: any, res: any, next: (error?: any) => void) {
    const token = req.headers.authorization;
    req.user = null;
    if (token) {
      if (token.match(/Basic /)) return next();

      let payloadJwt: IPayloadJwt;
      try {
        payloadJwt = jwtDecode(token);
      } catch (e) {
        this.logger.error(e.toString());
        throw new JwtTokenInvalidException();
      }
      const apiAuth = new ApiAuth({ baseURL: process.env.URL_API_AUTH });
      const verifyDto = (
        await apiAuth.auth.verifyEtherSignature({
          payload: payloadJwt.address,
          signature: payloadJwt.signature,
          signType: payloadJwt.signType,
        })
      ).data;

      const { address } = verifyDto;
      if (address) {
        req.user = { authorization: token, address, payloadAddress: payloadJwt.address };
      }
    }
    next();
  }
}
