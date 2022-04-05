import * as Web3Utils from 'web3-utils';
import Web3 from 'web3';

import { valueNullOrUndefined } from './utils';
import { AddressMustHaveTheRightFormatException, AddressMustNotBeEmptyException } from '../exceptions/users.exceptions';

const web3 = new Web3();

export function convertToChecksumAddress(address: string, required: boolean) {
  if (valueNullOrUndefined(address) || address === '') {
    if (required) throw new AddressMustNotBeEmptyException();
    else return null;
  }
  try {
    return Web3Utils.toChecksumAddress(address);
  } catch (e) {
    throw new AddressMustHaveTheRightFormatException(address);
  }
}

export function recoverAddress(message: string, signature: string): string {
  const signedAddress = web3.eth.accounts.recover(message, signature);
  return convertToChecksumAddress(signedAddress, true);
}
