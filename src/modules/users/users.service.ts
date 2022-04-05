import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from '../../schemas/users.schema';
import { Model } from 'mongoose';
import { UsersStatus } from '../../shares/enums/users.enum';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private readonly usersModel: Model<UsersDocument>) {}
  async findAnActiveUser(wallet_address: string): Promise<UsersDocument> {
    return this.usersModel.findOne({
      wallet_address,
      status: UsersStatus.ACTIVE,
    });
  }
}
