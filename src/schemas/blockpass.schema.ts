import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BlockPassDocument = BlockPass & Document;

@Schema({ timestamps: true })
export class BlockPass {
  @Prop({
    type: String,
  })
  clientId: string;

  @Prop({
    type: String,
  })
  guid: string;

  @Prop({
    type: String,
  })
  status: string;

  @Prop({
    type: String,
  })
  event: string;

  @Prop({
    type: String,
  })
  recordId: string;

  @Prop({
    type: String,
  })
  refId: string;

  @Prop({
    type: Number,
  })
  submitCount: number;

  @Prop({
    type: String,
  })
  blockPassID: string;

  @Prop({
    type: Date,
  })
  inreviewDate: Date;

  @Prop({
    type: Date,
  })
  waitingDate: Date;

  @Prop({
    type: Date,
  })
  approvedDate: Date;

  @Prop({
    type: String,
  })
  email: string;

  @Prop({
    type: String,
  })
  walletAddress: string;

  @Prop({
    type: String,
  })
  env: string;
}

export const BlockPassSchema = SchemaFactory.createForClass(BlockPass);
