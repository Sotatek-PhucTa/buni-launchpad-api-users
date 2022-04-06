import { Module } from '@nestjs/common';
import { BlockPassController } from './blockpass.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockPass, BlockPassSchema } from '../../schemas/blockpass.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: BlockPass.name, schema: BlockPassSchema }])],
  controllers: [BlockPassController],
})
export class BlockPassModule {}
