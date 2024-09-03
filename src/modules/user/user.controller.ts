import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserEntity } from 'src/entities';
import { CurrentUser } from 'src/helpers/decorators';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { UpdateUserDTO } from './dto';
import { UserService } from './user.service';
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('profile')
  public async profile(@CurrentUser() user: UserEntity) {
    return await this.service.getProfile(user);
  }

  @Put('profile')
  public async update(
    @CurrentUser() user: UserEntity,
    @Body() body: UpdateUserDTO,
  ) {
    return await this.service.updateDetail(user, body);
  }
}
