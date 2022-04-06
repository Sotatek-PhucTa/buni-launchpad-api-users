import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlockPassAuth } from '../../shares/decorators/blockpass-auth.decorator';
import { BlockPassUpdateStatusRequestDto } from './dto/blockpass-update-status.request.dto';
import { BlockPassService } from './blockpass.service';

@ApiTags('block-pass')
@UseGuards(BlockPassAuth)
@Controller('block-pass')
export class BlockPassController {
  constructor(private readonly blockPassService: BlockPassService) {}
  @Post('receive')
  async receiveUpdateStatus(param: BlockPassUpdateStatusRequestDto) {
    await this.blockPassService.kycUpdateStatus(param);
  }
}
