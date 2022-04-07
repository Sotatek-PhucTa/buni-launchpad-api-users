import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from '../../schemas/users.schema';
import { UsersService } from './users.service';
import { BlockPassModule } from '../blockpass/blockpass.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]), forwardRef(() => BlockPassModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
