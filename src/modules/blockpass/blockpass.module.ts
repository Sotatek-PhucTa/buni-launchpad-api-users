import { forwardRef, Module } from '@nestjs/common';
import { BlockPassController } from './blockpass.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockPass, BlockPassSchema } from '../../schemas/blockpass.schema';
import { UsersModule } from '../users/users.module';
import { BlockPassService } from './blockpass.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BlockPass.name, schema: BlockPassSchema }]),
    forwardRef(() => UsersModule),
  ],
  controllers: [BlockPassController],
  providers: [BlockPassService],
  exports: [BlockPassService],
})
export class BlockPassModule {}
