import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UsersRole, UsersStatus } from '../shares/enums/users.enum';

export type UsersDocument = Users & Document;

@Schema({ timestamps: true })
export class Users {
  @Prop({
    name: 'id',
    type: String,
  })
  id: string;

  @Prop({
    name: 'username',
    type: String,
    unique: true,
    index: true,
  })
  username: string;

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
}

export const UsersSchema = SchemaFactory.createForClass(Users);
