import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/entities';
import { PaginationDTO } from '../dto';
import { TaskPaginationDTO } from '../tasks/dto';
import { TaskService } from '../tasks/task.service';

@Injectable()
export class MobileService {
  constructor(private readonly taskService: TaskService) {}

  async taskPagination(
    user: UserEntity,
    data: PaginationDTO<TaskPaginationDTO>,
  ) {
    return await this.taskService.pagination(data, user);
  }

  async taskDetail(user: UserEntity, taskId: string) {
    return await this.taskService.detail(taskId, user);
  }
}
