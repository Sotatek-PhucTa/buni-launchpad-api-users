import { Injectable } from '@nestjs/common';
import { BlockPassUpdateStatusRequestDto } from './dto/blockpass-update-status.request.dto';
import fetch from 'node-fetch';
import {
  BlockPassApiFailedException,
  BlockPassResponseDoesNotHaveRequiredValueException,
} from '../../shares/exceptions/blockpass.exception';
import { InjectModel } from '@nestjs/mongoose';
import { BlockPass, BlockPassDocument } from '../../schemas/blockpass.schema';
import { Model } from 'mongoose';
import { valueNullOrUndefined } from '../../shares/utils/utils';
import { UsersService } from '../users/users.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Injectable()
export class BlockPassService {
  constructor(
    @InjectModel(BlockPass.name) private readonly blockPassModel: Model<BlockPassDocument>,
    private readonly usersService: UsersService,
  ) {}

  async kycUpdateStatus(param: BlockPassUpdateStatusRequestDto) {
    console.log(`BlockPass Update`);
    console.log(param);
    const url = process.env.BLOCK_PASS_API_URL.replace('CLIENT_ID', process.env.BLOCK_PASS_CLIENT_ID).replace(
      'RECORDID',
      param.recordId,
    );
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: process.env.BLOCK_PASS_API_KEY,
      },
    });
    if (!response || response.status !== 200) {
      console.log(`Failed when call blockpass api with record ${param.recordId}`);
      return new BlockPassApiFailedException(param.recordId);
    }

    const responseBody = JSON.parse(response.body).data;
    const email = responseBody.identities.email.value;
    const wallet = responseBody.identities.crypto_address_eth.value;
    const kycStatus = responseBody.status;

    const addressCountry = JSON.parse(responseBody.identities.address?.value)?.country || '';
    const nationalIssuingCountry =
      responseBody.identities.passport_issuing_country?.value ||
      responseBody.identities.national_id_issuing_country?.value ||
      responseBody.identities.driving_license_issuing_country?.value ||
      addressCountry;

    await this.blockPassModel.create({
      ...param,
      email: email,
      walletAddress: wallet,
    });

    if (kycStatus.toString() === 'approved') {
      await this.blockPassModel.findOneAndUpdate(
        {
          recordId: param.recordId,
        },
        { ...param, email: email, walletAddress: wallet },
        { upsert: true },
      );
    }

    if (valueNullOrUndefined(email))
      throw new BlockPassResponseDoesNotHaveRequiredValueException(param.recordId, 'email');

    if (valueNullOrUndefined(wallet))
      throw new BlockPassResponseDoesNotHaveRequiredValueException(param.recordId, 'wallet');

    await this.usersService.updateKycStatusOfUser({
      recordId: param.recordId,
      refId: param.recordId,
      kycStatus,
      email,
      wallet,
      nationalIssuingCountry,
      addressCountry,
    });
  }
}
