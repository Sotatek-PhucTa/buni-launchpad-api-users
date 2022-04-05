import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { convertToChecksumAddress } from '../../shares/utils/convert.util';

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

  @Expose()
  @ApiProperty({
    type: String,
    name: 'signature',
    required: true,
  })
  @IsNotEmpty()
  signature: string;
}
