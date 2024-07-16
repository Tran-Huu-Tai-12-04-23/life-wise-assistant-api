import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from 'src/entities';
import { CurrentUser } from 'src/helpers/decorators';
import { UserDataDTO } from '../auth/dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import {
  ChangeStatusTaskDTO,
  MoveTaskInAnotherColumnDTO,
  MoveTaskInTheSameColumnDTO,
  TaskDTO,
  TaskPaginationDTO,
} from './dto';
import { TaskService } from './task.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Tasks CRUD')
@Controller('task')
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @ApiOperation({
    summary: 'Pagination for task',
  })
  @ApiResponse({ status: 201 })
  @Post()
  async pagination(@Body() taskPaginationDTO: TaskPaginationDTO) {
    return await this.service.pagination(taskPaginationDTO);
  }

  @ApiOperation({
    summary: 'Add task to column',
  })
  @ApiResponse({ status: 201 })
  @Post()
  async addTaskToColumn(
    @Body() taskDTO: TaskDTO,
    @CurrentUser() user: UserDataDTO,
  ) {
    return await this.service.create(taskDTO, user);
  }
  @ApiOperation({
    summary: 'Move task in the same column',
  })
  @Post('move-task-in-the-same-column')
  async moveTaskInTheSameColumn(
    @Body() moveTaskInTheSameColumnDTO: MoveTaskInTheSameColumnDTO,
  ) {
    return await this.service.moveTaskInTheSameColumn(
      moveTaskInTheSameColumnDTO,
    );
  }

  @ApiOperation({
    summary: 'Move task to different column',
  })
  @Post('move-task-to-diff-column')
  async moveTaskToDiffCol(
    @Body() moveTaskToDiffCol: MoveTaskInAnotherColumnDTO,
    @CurrentUser() user: UserDataDTO,
  ) {
    return await this.service.moveTaskToAnotherColumn(moveTaskToDiffCol, user);
  }

  @ApiOperation({
    summary: 'Change status task',
  })
  @ApiResponse({ status: 201 })
  @Post('update-status')
  async updateStatusTask(
    @Body() changeStatusTaskDTO: ChangeStatusTaskDTO,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.service.changeStatus(changeStatusTaskDTO, user);
  }

  @ApiOperation({
    summary: 'Delete task',
  })
  @ApiResponse({ status: 201 })
  @Delete('delete/:id')
  async deleteTask(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return await this.service.deleteSoft(id, user);
  }

  @ApiOperation({
    summary: 'Restore task',
  })
  @ApiResponse({ status: 201 })
  @Post('restore/:id')
  async restoreTask(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return await this.service.restoreTask(id, user);
  }

  @ApiOperation({
    summary: 'Delete task',
  })
  @ApiResponse({ status: 201 })
  @Post('force-delete/:id')
  async forceDelete(@Param('id') id: string) {
    return await this.service.deleteForce(id);
  }

  @ApiOperation({
    summary: 'Update tasks',
  })
  @ApiResponse({ status: 201 })
  @Put('update/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() taskDTO: TaskDTO,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.service.update(taskDTO, id, user);
  }
}
