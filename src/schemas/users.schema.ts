import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UsersRole, UsersStatus } from '../shares/enums/users.enum';
import { KYC_STATUS } from '../shares/enums/blockpass.enum';

export type UsersDocument = Users & Document;

@Schema({ timestamps: true })
export class Users {
  @Prop({
    name: 'email',
    type: String,
  })
  email: string;

  @Prop({
    name: 'wallet_address',
    index: true,
    unique: true,
    type: String,
  })
  wallet_address: string;

  @Prop({
    name: 'status',
    enum: UsersStatus,
  })
  status: UsersStatus;

  @Prop({
    name: 'role',
    enum: UsersRole,
  })
  role: UsersRole;

  @Prop({
    type: String,
  })
  recordId: string;

  @Prop({
    type: String,
  })
  refId: string;

  @Prop({
    type: String,
  })
  nationalIdIssuingCountry: string;

  @Prop({
    type: String,
  })
  addressCountry: string;

  @Prop({
    enum: KYC_STATUS,
  })
  kycStatus: KYC_STATUS;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
