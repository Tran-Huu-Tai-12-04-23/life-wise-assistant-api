import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { enumData } from 'src/constants/enum-data';
import { ColumnEntity, UserEntity } from 'src/entities';
import { SubTaskEntity } from 'src/entities/subTask.entity';
import { TaskEntity } from 'src/entities/task.entity';
import { TaskCommentEntity } from 'src/entities/taskComment.entity';
import { TaskFileEntity } from 'src/entities/taskFile.entity';
import { TaskHistoryEntity } from 'src/entities/taskHistory.entity';
import { coreHelper } from 'src/helpers';
import { TaskRepository, UserRepository } from 'src/repositories';
import { Between, In, Like, MoreThan } from 'typeorm';
import { UserDataDTO } from '../auth/dto';
import { DiscordService } from '../discord/discord.service';
import { TaskLogDTO } from '../discord/dto';
import { ColumnRepository } from './../../repositories/column.repository';
import {
  ChangeStatusTaskDTO,
  MoveTaskInAnotherColumnDTO,
  MoveTaskInTheSameColumnDTO,
  TaskDTO,
  TaskPaginationDTO,
} from './dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly columnRepository: ColumnRepository,
    private readonly userRepository: UserRepository,
    private readonly discordService: DiscordService,
    private readonly configService: ConfigService,
  ) {}

  FRONT_END_LINK = this.configService.get<string>('FRONT_END_LINK');

  async pagination(taskPaginationDTO: TaskPaginationDTO) {
    const { status, teamId, columnId, userId, teamMemberId, search } =
      taskPaginationDTO;

    const whereCon: any = {};
    if (status) {
      whereCon.status = status;
    }
    if (teamId) {
      whereCon.team = { id: teamId };
    }
    if (columnId) {
      whereCon.column = { id: columnId };
    }
    if (userId) {
      whereCon.createdBy = { id: userId };
    }
    if (teamMemberId) {
      whereCon.lstPersonInCharge = { id: teamMemberId };
    }
    if (search) {
      whereCon.title = Like(`%${search}%`);
    }

    const tasks: any = await this.taskRepository.findAndCount({
      where: { ...whereCon, isDeleted: false },
      order: { index: 'ASC' },
      relations: { lstPersonInCharge: true },
      skip: taskPaginationDTO.skip,
      take: taskPaginationDTO.take,
    });

    const resultTask = tasks[0].map((task: any) => {
      const lstPersonInCharge = task.__lstPersonInCharge__;
      delete task.__lstPersonInCharge__;
      const statusOfTask = coreHelper.getStatusOfTask(task.status);
      const priorityOfTask = coreHelper.getPriorityOfTask(task.priority);
      const typeOfTask = coreHelper.getPriorityOfTask(task.type);
      return {
        lstPersonInCharge,
        ...task,
        statusName: statusOfTask?.name,
        statusColor: statusOfTask?.color,
        statusBackground: statusOfTask?.background,
        priorityName: priorityOfTask?.name,
        priorityColor: priorityOfTask?.color,
        priorityBackground: priorityOfTask?.background,
        typeName: typeOfTask?.name,
        typeColor: typeOfTask?.color,
        typeBackground: typeOfTask?.background,
      };
    });

    return [resultTask, tasks[1]];
  }

  async create(taskDTO: TaskDTO, user: UserDataDTO) {
    return await this.taskRepository.manager.transaction(
      async (transaction) => {
        const taskRepo = transaction.getRepository(TaskEntity);
        const taskCommentRepo = transaction.getRepository(TaskCommentEntity);
        const taskFileRepo = transaction.getRepository(TaskFileEntity);
        const taskHistoryRepo = transaction.getRepository(TaskHistoryEntity);
        const subTaskRepo = transaction.getRepository(SubTaskEntity);
        const columnRepo = transaction.getRepository(ColumnEntity);
        const column: any = await columnRepo.findOne({
          where: { id: taskDTO.columnId },
          relations: { tasks: true },
        });

        if (column == null) {
          throw new Error('Column not found!');
        }

        const lstPersonInCharge = await this.userRepository.find({
          where: {
            id: In([...taskDTO.lstPersonInCharge]),
            isDeleted: false,
          },
        });
        //#region  create new task
        const newIndexTask = column.__tasks__.length + 1;
        const newTask = new TaskEntity();

        newTask.index = newIndexTask;
        newTask.priority = taskDTO.priority;
        newTask.type = taskDTO.type;
        newTask.title = taskDTO.title;
        newTask.description = taskDTO.description;
        newTask.sourceCodeLink = taskDTO.sourceCodeLink;
        newTask.column = Promise.resolve(column);
        newTask.lstPersonInCharge = Promise.resolve(lstPersonInCharge);
        newTask.createdBy = user.id;
        newTask.createdByName = user.username;
        newTask.createdAt = new Date();
        newTask.expireDate = taskDTO.expireDate;
        newTask.cmdCheckOutBranch = `git checkout -b ${taskDTO.title}`;
        newTask.cmdCommit = `git commit -m "feature: ${taskDTO.title}"`;
        newTask.status = column.statusCode;

        await taskRepo.save(newTask);
        //#endregion

        //#region  add task comment
        for (const comment of taskDTO.comments) {
          const newComment = new TaskCommentEntity();
          newComment.content = comment.content;
          newComment.taskId = newTask.id;
          newComment.createdBy = user.id;
          newComment.createdByName = user.username;
          newComment.createdAt = new Date();
          await taskCommentRepo.save(newComment);
        }
        //#endregion

        //#region  add sub task
        for (const subTask of taskDTO.subTasks) {
          const newSubTask = new SubTaskEntity();
          newSubTask.name = subTask.name;
          newSubTask.taskId = newTask.id;
          newSubTask.isChecked = subTask.isChecked;
          newSubTask.createdBy = user.id;
          newSubTask.createdByName = user.username;
          newSubTask.createdAt = new Date();
          await subTaskRepo.save(newSubTask);
        }
        //#endregion

        //#region  add task file
        for (const file of taskDTO.taskFile) {
          const newFile = new TaskFileEntity();
          newFile.fileLink = file.fileLink;
          newFile.taskId = newTask.id;
          newFile.createdBy = user.id;
          newFile.createdByName = user.username;
          newFile.createdAt = new Date();
          await taskFileRepo.save(newFile);
        }
        //#endregion

        //#region  add task history
        const newTaskHistory = new TaskHistoryEntity();
        newTaskHistory.taskId = newTask.id;
        newTaskHistory.createdBy = user.id;
        newTaskHistory.createdByName = user.username;
        newTaskHistory.createdAt = new Date();
        newTaskHistory.description =
          'User ' +
          user.username +
          ' create new task at ' +
          new Date().toString();
        await taskHistoryRepo.save(newTaskHistory);
        //#endregion

        //#region  log to discord
        const taskLog: TaskLogDTO = {
          taskName: newTask.title,
          memberName: user.userDetail?.fullName || user.username,
          link: this.FRONT_END_LINK + '/tasks/' + newTask.id,
          statusName: newTask.status,
          message:
            user.userDetail?.fullName ||
            user.username + ' create new task at ' + new Date().toString(),
          timeString: new Date().toString(),
        };
        await this.discordService.taskLog(taskLog);
        //#endregion

        //#region return detail task
        const taskDetail: any = await taskRepo.findOne({
          where: { id: newTask.id, isDeleted: false },
          relations: {
            lstPersonInCharge: true,
          },
        });
        const lstMember = taskDetail.__lstPersonInCharge__;
        delete taskDetail.__lstMember__;
        //#endregion

        return {
          message: 'Task created successfully',
          data: { ...taskDetail, lstMember },
        };
      },
    );
  }

  // move task in the same column and in the same team
  async moveTaskInTheSameColumn(
    moveTaskInTheSameColumnDTO: MoveTaskInTheSameColumnDTO,
  ) {
    const taskCurrentIndex = moveTaskInTheSameColumnDTO.taskCurrentIndex;
    const taskNewIndex = moveTaskInTheSameColumnDTO.taskNewIndex;
    const columnId = moveTaskInTheSameColumnDTO.columnId;

    // Check user permission (same as before)

    // Fetch tasks in the affected range (inclusive)
    const affectedTasks = await this.taskRepository.find({
      where: {
        index:
          taskCurrentIndex < taskNewIndex
            ? Between(taskCurrentIndex, taskNewIndex)
            : Between(taskNewIndex, taskCurrentIndex),
        column: { id: columnId },
      },
      order: { index: 'ASC' },
    });

    // Efficiently update task indices using a single transaction
    await this.taskRepository.manager.transaction(async (transaction) => {
      const currentTask = affectedTasks.find(
        (task) => task.index === taskCurrentIndex,
      )!;
      if (!currentTask) {
        throw new NotFoundException('Task not found!');
      }
      currentTask.index = taskNewIndex;
      affectedTasks.forEach((task) => {
        if (task !== currentTask) {
          task.index = task.index + 1;
        }
      });

      await transaction.save(affectedTasks);
    });

    return {
      message: 'Task moved successfully!',
    };
  }

  // move task in the another column and in the same team
  async moveTaskToAnotherColumn(
    moveTaskDTO: MoveTaskInAnotherColumnDTO,
    user: UserDataDTO,
  ) {
    const { taskCurrentIndex, taskNewIndex, columnIdFrom, columnIdTo } =
      moveTaskDTO;

    // Retrieve the target column (where the task will be moved to)
    const columnTo = await this.columnRepository.findOneBy({ id: columnIdTo });
    if (!columnTo) {
      throw new NotFoundException('Column not found!');
    }

    // Fetch tasks affected in the source and destination columns
    const [targetTasks, sourceTask, sourceTasks] = await Promise.all([
      this.taskRepository.find({
        where: {
          column: { id: columnIdTo },
          index: MoreThan(taskNewIndex - 1),
        },
        order: { index: 'ASC' },
      }),
      this.taskRepository.findOne({
        where: {
          column: { id: columnIdFrom },
          index: taskCurrentIndex,
        },
      }),
      this.taskRepository.find({
        where: {
          column: { id: columnIdFrom },
          index: MoreThan(taskCurrentIndex),
        },
      }),
    ]);

    if (!sourceTask) {
      throw new NotFoundException('Task not found!');
    }

    // Efficiently update task indices using a single transaction
    await this.taskRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // Update indices for target tasks in the destination column
        for (const task of targetTasks) {
          task.index += 1;
        }

        // Update indices for source tasks in the source column
        for (const task of sourceTasks) {
          task.index -= 1;
        }

        // Update the source task's details
        sourceTask.index = taskNewIndex;
        sourceTask.status = columnTo.statusCode;
        sourceTask.column = Promise.resolve(columnTo);
        sourceTask.updatedBy = user.id;
        sourceTask.updatedAt = new Date();

        const taskLog: TaskLogDTO = {
          taskName: sourceTask.title,
          memberName: user.userDetail?.fullName || user.username,
          link: this.FRONT_END_LINK + '/tasks/' + sourceTask.id,
          statusName: columnTo.statusCode,
          message:
            user.userDetail?.fullName ||
            user.username +
              '   ' +
              ' moved task to ' +
              columnTo.statusCode +
              'at ' +
              '    ' +
              new Date().toString(),
          timeString: new Date().toString(),
        };

        await this.discordService.taskLog(taskLog);
        // Save all updated tasks within the transaction
        await transactionalEntityManager.save([
          ...targetTasks,
          ...sourceTasks,
          sourceTask,
        ]);
      },
    );

    // Get the status name of the target column
    const statusNameTo =
      enumData.taskStatus[
        columnTo.statusCode as keyof typeof enumData.taskStatus
      ].name;

    return {
      message: `${sourceTask.title} moved to ${statusNameTo}`,
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
      task.lstPersonInCharge = Promise.resolve(lstPersonInCharge);
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
