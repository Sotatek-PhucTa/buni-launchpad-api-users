export interface IPayloadJwt {
  address: string;
  signature: string;
  signType?: string;
  iat: number;
  exp: number;
}
