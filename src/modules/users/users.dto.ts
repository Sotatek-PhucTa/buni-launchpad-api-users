import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { convertToChecksumAddress } from '../../shares/utils/web3.util';

@Exclude()
export class UserLoginRequestDto {
  @Expose()
  @ApiProperty({
    type: String,
    name: 'wallet_address',
    required: true,
  })
  @Transform(({ value }) => convertToChecksumAddress(value, true))
  wallet_address: string;
}
