import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserLoginRequestDto } from './dto/users.dto';
import { UserSigned } from '../../shares/decorators/user-signed.decorator';
import { UserAddress } from '../../shares/decorators/users.decorator';
import { UsersService } from './users.service';
import { UserProfileResponseDto } from './dto/user-profile.response.dto';
import { plainToClass } from 'class-transformer';

@ApiTags('users')
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
  async getProfile(@UserAddress() userAddress: string): Promise<UserProfileResponseDto> {
    const userProfile = await this.usersService.getProfile(userAddress);
    return plainToClass(UserProfileResponseDto, userProfile);
  }
}
