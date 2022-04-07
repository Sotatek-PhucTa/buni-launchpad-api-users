import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from '../../schemas/users.schema';
import { Model } from 'mongoose';
import { KYC_STATUS } from '../../shares/enums/blockpass.enum';
import { valueNullOrUndefined } from '../../shares/utils/utils';
import { UserNotFoundException } from '../../shares/exceptions/users.exceptions';
import { BlockPassService } from '../blockpass/blockpass.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<UsersDocument>,
    @Inject(forwardRef(() => BlockPassService))
    private readonly blockPassService: BlockPassService,
  ) {}
  async findAnUser(userAddress: string): Promise<UsersDocument> {
    return this.usersModel.findOne({
      wallet_address: userAddress,
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

  async getProfile(userAddress: string) {
    const user = await this.findAnUser(userAddress);
    if (valueNullOrUndefined(user)) throw new UserNotFoundException(userAddress);
  }
}
