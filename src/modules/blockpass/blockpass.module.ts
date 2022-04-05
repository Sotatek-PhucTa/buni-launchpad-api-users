import { Module } from '@nestjs/common';
import { BlockPassController } from './blockpass.controller';

@Module({
  controllers: [BlockPassController],
})
export class BlockPassModule {}
