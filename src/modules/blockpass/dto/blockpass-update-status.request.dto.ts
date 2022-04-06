import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class BlockPassUpdateStatusRequestDto {
  @Expose()
  @ApiProperty({
    type: String,
  })
  guid: string;

  @Expose()
  @ApiProperty({
    type: String,
  })
  status: string;

  @Expose()
  @ApiProperty({
    type: String,
  })
  clientId: string;

  @Expose()
  @ApiProperty({
    type: String,
  })
  event: string;

  @Expose()
  @ApiProperty({
    type: String,
  })
  recordId: string;

  @Expose()
  @ApiProperty({
    type: String,
  })
  refId: string;

  @Expose()
  @ApiProperty({
    type: Number,
  })
  submitCount: number;

  @Expose()
  @ApiProperty({
    type: String,
  })
  blockPassID: string;

  @Expose()
  @ApiProperty({
    type: Date,
  })
  inreviewDate: Date;

  @Expose()
  @ApiProperty({
    type: Date,
  })
  waitingDate: Date;

  @Expose()
  @ApiProperty({
    type: Date,
  })
  approvedDate: Date;

  @Expose()
  @ApiProperty({
    type: String,
  })
  env: string;
}
