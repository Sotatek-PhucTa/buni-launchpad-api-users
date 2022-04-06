import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from '../../schemas/users.schema';
import { Model } from 'mongoose';
import { UsersStatus } from '../../shares/enums/users.enum';
import { BlockPassUpdateStatusRequestDto } from '../blockpass/dto/blockpass-update-status.request.dto';
import { KYC_STATUS } from '../../shares/enums/blockpass.enum';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private readonly usersModel: Model<UsersDocument>) {}
  async findAnActiveUser(wallet_address: string): Promise<UsersDocument> {
    return this.usersModel.findOne({
      wallet_address,
      status: UsersStatus.ACTIVE,
    });
  }

  async updateKycStatusOfUser(param: {
    recordId: string;
    refId: string;
    kycStatus: string;
    email: string;
    wallet: string;
    nationalIssuingCountry: string;
    addressCountry: string;
  }) {
    await this.usersModel.findOneAndUpdate(
      {
        wallet_address: param.wallet,
        email: param.email,
      },
      {
        recordId: param.recordId,
        refId: param.refId,
        nationalIssuingCountry: param.nationalIssuingCountry,
        addressCountry: param.addressCountry,
        kycStatus: KYC_STATUS[param.kycStatus.toUpperCase()],
      },
      { upsert: true },
    );
  }
}
