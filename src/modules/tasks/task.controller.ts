import {
  Body,
  Controller,
  Delete,
  Get,
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
import { PaginationDTO } from '../dto';
import {
  MoveTaskInAnotherColumnDTO,
  MoveTaskInTheSameColumnDTO,
  TaskDTO,
  TaskPaginationDTO,
} from './dto';
import { TaskService } from './task.service';
import {
  AddSubTaskDTO,
  AddTaskCommentDTO,
  AddTaskFileDTO,
  EditTaskCommentDTO,
  UpdateTaskDTO,
} from './updateTask.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Tasks CRUD')
@Controller('task')
export class TaskController {
  constructor(private readonly service: TaskService) {}

  // #region pagination for reference task
  @ApiOperation({
    summary: 'Get sub task pagination',
  })
  @ApiResponse({ status: 201 })
  @Post('sub-task-pagination')
  async subTaskPagination(@Body() data: PaginationDTO) {
    return await this.service.subTaskPagination(data);
  }

  @ApiOperation({
    summary: 'Get task file pagination',
  })
  @ApiResponse({ status: 201 })
  @Post('task-file-pagination')
  async taskFilePagination(@Body() data: PaginationDTO) {
    return await this.service.taskFilePagination(data);
  }

  @ApiOperation({
    summary: 'Get task comment pagination',
  })
  @ApiResponse({ status: 201 })
  @Post('task-comment-pagination')
  async taskCommentPagination(
    @Body() data: PaginationDTO,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.service.taskCommentPagination(data, user);
  }

  @ApiOperation({
    summary: 'Get task comment pagination',
  })
  @ApiResponse({ status: 201 })
  @Post('task-history-pagination')
  async taskHistoryPagination(@Body() data: PaginationDTO) {
    return await this.service.taskHistoryPagination(data);
  }
  // #endregion

  //#region CRUD sub task
  @ApiOperation({
    summary: 'Add sub task',
  })
  @ApiResponse({ status: 201 })
  @Post('add-sub-task')
  async addSubTask(
    @Body() data: AddSubTaskDTO,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.service.addSubTask(data, user);
  }

  @ApiOperation({
    summary: 'Sub task toggle ',
  })
  @ApiResponse({ status: 201 })
  @Put('toggle-sub-task/:id')
  async toggleSubTask(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.service.toggleSubTask(id, user);
  }

  @ApiOperation({
    summary: 'Delete sub task',
  })
  @ApiResponse({ status: 201 })
  @Delete('delete-sub-task/:id')
  async deleteSubTask(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.service.removeSubTask(id, user);
  }

  //#endregion
  //#region CRUD task file
  @ApiOperation({
    summary: 'Add comment to task',
  })
  @ApiResponse({ status: 201 })
  @Post('add-comment')
  async addComment(
    @Body() data: AddTaskCommentDTO,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.service.addTaskComment(data, user);
  }

  @ApiOperation({
    summary: 'Edit comment!',
  })
  @ApiResponse({ status: 201 })
  @Put('edit-comment')
  async editComment(
    @Body() data: EditTaskCommentDTO,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.service.editTaskComment(data, user);
  }

  @ApiOperation({
    summary: 'Delete comment',
  })
  @ApiResponse({ status: 201 })
  @Delete('delete-comment/:id')
  async deleteComment(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.service.removeTaskComment(id, user);
  }
  //#endregion
  //#region CRUD task file
  @ApiOperation({
    summary: 'add task file ',
  })
  @ApiResponse({ status: 201 })
  @Post('add-task-file')
  async addTaskFile(
    @Body() data: AddTaskFileDTO,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.service.addTaskFile(data, user);
  }

  @ApiOperation({
    summary: 'delete task file ',
  })
  @ApiResponse({ status: 201 })
  @Delete('delete-task-file/:id')
  async deleteTaskFile(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.service.removeTaskFile(id, user);
  }

  // #endregion

  // #region CRUD task
  @ApiOperation({
    summary: 'update task ',
  })
  @ApiResponse({ status: 201 })
  @Put()
  async update(
    @Body() updateTaskDTO: UpdateTaskDTO,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.service.update(updateTaskDTO, user);
  }

  @ApiOperation({
    summary: 'task detail',
  })
  @ApiResponse({ status: 201 })
  @Get('/:id')
  async detail(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return await this.service.detail(id, user);
  }

  @ApiResponse({ status: 201 })
  @Post('/pagination')
  async pagination(@Body() taskPaginationDTO: TaskPaginationDTO) {
    return await this.service.pagination(taskPaginationDTO);
  }

  @ApiOperation({
    summary: 'Add task to column',
  })
  @ApiResponse({ status: 201 })
  @Post()
  async createNewTask(
    @Body() taskDTO: TaskDTO,
    @CurrentUser() user: UserDataDTO,
  ) {
    return await this.service.create(taskDTO, user);
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

  // #endregion

  // #region Move task in column
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
  // #endregion
}
