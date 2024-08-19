import { Body, Controller, Get } from '@nestjs/common';
import { UserEntity } from 'src/entities';
import { CurrentUser } from 'src/helpers/decorators';
import { UpdateUserDTO } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('profile')
  public async profile(@CurrentUser() user: UserEntity) {
    return await this.service.getProfile(user);
  }

  @Get('update-detail')
  public async update(
    @CurrentUser() user: UserEntity,
    @Body() body: UpdateUserDTO,
  ) {
    return await this.service.updateDetail(user, body);
  }
}
