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
import { KYC_STATUS } from '../../shares/enums/blockpass.enum';
import { valueNullOrUndefined } from '../../shares/utils/utils';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Injectable()
export class BlockPassService {
  constructor(@InjectModel(BlockPass.name) private readonly blockPassModel: Model<BlockPassDocument>) {}
  async kycUpdateStatus(blockPassUpdateStatusRequestDto: BlockPassUpdateStatusRequestDto) {
    console.log(`BlockPass Update`);
    console.log(blockPassUpdateStatusRequestDto);
    const url = process.env.BLOCK_PASS_API_URL.replace('CLIENT_ID', process.env.BLOCK_PASS_CLIENT_ID).replace(
      'RECORDID',
      blockPassUpdateStatusRequestDto.recordId,
    );
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: process.env.BLOCK_PASS_API_KEY,
      },
    });
    if (!response || response.status !== 200) {
      console.log(`Failed when call blockpass api with record ${blockPassUpdateStatusRequestDto.recordId}`);
      return new BlockPassApiFailedException(blockPassUpdateStatusRequestDto.recordId);
    }

    const responseBody = JSON.parse(response.body).data;
    const email = responseBody.identities.email.value;
    const wallet = responseBody.identities.crypto_address_eth.value;
    const kycStatus = responseBody.status;

    const addressCountry = JSON.parse(responseBody.identities.address?.value)?.country || '';
    const passportIssuingCountry =
      responseBody.identities.passport_issuing_country?.value ||
      responseBody.identities.national_id_issuing_country?.value ||
      responseBody.identities.driving_license_issuing_country?.value ||
      addressCountry;

    await this.blockPassModel.create({
      ...blockPassUpdateStatusRequestDto,
      email: email,
      walletAddress: wallet,
    });

    if (kycStatus.toString() === 'approved') {
      await this.blockPassModel.findOneAndUpdate(
        {
          recordId: blockPassUpdateStatusRequestDto.recordId,
        },
        { ...blockPassUpdateStatusRequestDto, email: email, walletAddress: wallet },
        { upsert: true },
      );
    }

    if (valueNullOrUndefined(email))
      throw new BlockPassResponseDoesNotHaveRequiredValueException(blockPassUpdateStatusRequestDto.recordId, 'email');

    if (valueNullOrUndefined(wallet))
      throw new BlockPassResponseDoesNotHaveRequiredValueException(blockPassUpdateStatusRequestDto.recordId, 'wallet');
  }
}
