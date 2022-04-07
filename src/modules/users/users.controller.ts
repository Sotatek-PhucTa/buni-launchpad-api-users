import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserLoginRequestDto } from './users.dto';
import { UserSigned } from '../../shares/decorators/user-signed.decorator';
import { UserAddress } from '../../shares/decorators/users.decorator';
import { UsersService } from './users.service';

@ApiTags('users')
@UseGuards(UserSigned)
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('login')
  async login(@Body() userLoginRequestDto: UserLoginRequestDto) {
    console.log(`User login`);
    console.log(userLoginRequestDto.wallet_address);
    return userLoginRequestDto.wallet_address;
  }

  @Get('profile')
  async getProfile(@UserAddress() userAddress: string) {
    await this.usersService.getProfile(userAddress);
  }
}
