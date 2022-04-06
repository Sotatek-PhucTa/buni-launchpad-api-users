import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlockPassAuth } from '../../shares/decorators/blockpass-auth.decorator';

@ApiTags('block-pass')
@UseGuards(BlockPassAuth)
@Controller('block-pass')
export class BlockPassController {}
