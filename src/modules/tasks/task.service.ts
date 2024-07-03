import { ColumnRepository } from './../../repositories/column.repository';
import { Injectable } from '@nestjs/common';
import { TaskEntity } from 'src/entities/task.entity';
import { TaskRepository, UserRepository } from 'src/repositories';
import { UserEntity } from 'src/entities';
import { In } from 'typeorm';
import { enumData } from 'src/constants/enum-data';
import { ChangeStatusTaskDTO, TaskDTO } from './dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly columnRepository: ColumnRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(taskDTO: TaskDTO, user: UserEntity) {
    const column = await this.columnRepository.findOneBy({
      id: taskDTO.columnId,
    });
    if (column == null) {
      throw new Error('Column not found!');
    }
    const lstPersonInCharge = await this.userRepository.find({
      where: {
        id: In([...taskDTO.lstPersonInCharge, user.id]),
        isDeleted: false,
      },
    });

    const newTask = new TaskEntity();

    if (lstPersonInCharge.length > 0) {
      newTask.lstMember = Promise.resolve(lstPersonInCharge);
    }
    newTask.title = taskDTO.title;
    newTask.description = taskDTO.description;
    newTask.column = Promise.resolve(column);
    newTask.createdBy = user.id;
    newTask.status = enumData.task_status.TO_ASSIGN.code;
    await this.taskRepository.insert(newTask);

    return {
      message: 'Task created successfully',
      data: newTask,
    };
  }

  async update(taskDTO: TaskDTO, taskId: string, user: UserEntity) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, isDeleted: false },
    });
    if (!task) {
      throw new Error('Task not found!');
    }
    const column = await this.columnRepository.findOneBy({
      id: taskDTO.columnId,
    });
    if (!column) {
      throw new Error('Column not found!');
    }
    const lstPersonInCharge = await this.userRepository.find({
      where: {
        id: In([...taskDTO.lstPersonInCharge, user.id]),
        isDeleted: false,
      },
    });
    task.title = taskDTO.title;
    task.description = taskDTO.description;
    if (lstPersonInCharge.length > 0) {
      task.lstMember = Promise.resolve(lstPersonInCharge);
    }
    task.updatedBy = user.id;
    await this.taskRepository.save(task);
    return {
      message: 'Task updated successfully',
      data: task,
    };
  }

  async deleteSoft(taskId: string, user: UserEntity) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, isDeleted: false },
    });
    if (!task) {
      throw new Error('Task not found!');
    }
    task.isDeleted = true;
    task.deleteBy = user.id;
    await this.taskRepository.save(task);
    return {
      message: 'Task deleted successfully',
      data: task,
    };
  }
  async restoreTask(taskId: string, user: UserEntity) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, isDeleted: false },
    });
    if (!task) {
      throw new Error('Task not found!');
    }
    task.isDeleted = false;
    task.deleteBy = user.id;
    task.updatedBy = user.id;
    await this.taskRepository.save(task);
    return {
      message: 'Task restore successfully',
      data: task,
    };
  }

  async deleteForce(taskId: string) {
    const task = await this.taskRepository.findOneBy({
      id: taskId,
      isDeleted: true,
    });
    if (!task) {
      throw new Error('Task not found!');
    }
    await this.taskRepository.delete(taskId);
    return {
      message: 'Task deleted successfully',
      data: task,
    };
  }

  async changeStatus(
    changeStatusTaskDTO: ChangeStatusTaskDTO,
    user: UserEntity,
  ) {
    const task = await this.taskRepository.findOneBy({
      id: changeStatusTaskDTO.taskId,
      isDeleted: false,
    });
    if (!task) {
      throw new Error('Task not found!');
    }
    task.status = changeStatusTaskDTO.status;
    task.updatedBy = user.id;
    await this.taskRepository.save(task);
    return {
      message: 'Status updated successfully',
      data: task,
    };
  }
}
