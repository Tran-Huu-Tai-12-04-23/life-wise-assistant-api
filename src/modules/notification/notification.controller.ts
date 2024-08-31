import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from 'src/entities';
import { CurrentUser } from 'src/helpers/decorators';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { PaginationDTO } from '../dto';
import { NotificationService } from './notification.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Notification CRUD')
@Controller('notification')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @ApiOperation({
    summary: 'Notification pagination',
  })
  @ApiResponse({ status: 201 })
  @Post('/pagination')
  async notificationPagination(
    @Body() data: PaginationDTO,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.service.notificationPagination(data, user);
  }

  @ApiOperation({
    summary: 'mask as read notification',
  })
  @ApiResponse({ status: 201 })
  @Put('/mask-as-read/:id')
  async maskAsRead(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return await this.service.maskAsRead(id, user);
  }
}
