import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class UserLoginRequestDto {
  @Expose()
  @ApiProperty({
    type: String,
    name: 'wallet_address',
    required: true,
  })
  wallet_address: string;

  @Expose()
  @ApiProperty({
    type: String,
    name: 'signature',
    required: true,
  })
  signature: string;
}
