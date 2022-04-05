import * as Web3Utils from 'web3-utils';

import { valueNullOrUndefined } from './utils';
import { AddressMustHaveTheRightFormat, AddressMustNotBeEmptyException } from '../exceptions/users.exceptions';

export function convertToChecksumAddress(address: string, required: boolean) {
  if (valueNullOrUndefined(address) || address === '') {
    if (required) throw new AddressMustNotBeEmptyException();
    else return null;
  }
  try {
    return Web3Utils.toChecksumAddress(address);
  } catch (e) {
    throw new AddressMustHaveTheRightFormat(address);
  }
}
