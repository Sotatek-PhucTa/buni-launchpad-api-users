import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserLoginRequestDto } from './users.dto';
import { UserSigned } from '../../shares/decorators/user-signed.decorator';

@ApiTags('users')
@UseGuards(UserSigned)
@Controller('user')
export class UsersController {
  @Post('login')
  async login(@Body() userLoginRequestDto: UserLoginRequestDto) {
    console.log(`User login`);
    console.log(userLoginRequestDto.wallet_address);
    return userLoginRequestDto.wallet_address;
  }
}
