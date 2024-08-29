import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TaskEntity, UserEntity } from 'src/entities';
import { CurrentUser } from 'src/helpers/decorators';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { PaginationDTO } from '../dto';
import { TaskPaginationDTO } from '../tasks/dto';
import { MobileService } from './module.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('mobile route')
@Controller('mobile')
export class MobileController {
  constructor(private readonly service: MobileService) {}

  //#region  task action
  @ApiOperation({
    summary: 'Task pagination',
  })
  @ApiResponse({ status: 200, type: TaskEntity })
  @Post('/task/pagination')
  async taskPagination(
    @CurrentUser() user: UserEntity,
    @Body() data: PaginationDTO<TaskPaginationDTO>,
  ) {
    return await this.service.taskPagination(user, data);
    // Implement the method logic here
  }
  //#endregion  task action
}
