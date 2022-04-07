import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UsersStatus } from '../../../shares/enums/users.enum';
import { KYC_STATUS } from '../../../shares/enums/blockpass.enum';

@Exclude()
export class UserProfileResponseDto {
  @Expose()
  @ApiProperty({
    type: String,
  })
  email: string;

  @Expose()
  @ApiProperty({
    enum: UsersStatus,
  })
  status: UsersStatus;

  @Expose()
  @ApiProperty({
    enum: KYC_STATUS,
  })
  kycStatus: KYC_STATUS;

  @Expose()
  @ApiProperty({
    type: String,
  })
  @Transform(({ obj }) => obj.recordId)
  blockPassRecordId: string;

  @Expose()
  @ApiProperty({
    type: String,
  })
  blockPassStatus: string;
}
