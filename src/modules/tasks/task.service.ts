import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import { enumData } from 'src/constants/enum-data';
import { ColumnEntity, UserEntity } from 'src/entities';
import { SubTaskEntity } from 'src/entities/subTask.entity';
import { TaskEntity } from 'src/entities/task.entity';
import { TaskCommentEntity } from 'src/entities/taskComment.entity';
import { TaskFileEntity } from 'src/entities/taskFile.entity';
import { TaskHistoryEntity } from 'src/entities/taskHistory.entity';
import { TeamHistoryEntity } from 'src/entities/teamHistory.entity';
import { coreHelper } from 'src/helpers';
import {
  TaskCommentRepository,
  TaskHistoryRepository,
  TaskRepository,
  UserRepository,
} from 'src/repositories';
import { SubTaskRepository } from 'src/repositories/subTask.repository';
import { TaskFileRepository } from 'src/repositories/taskFile.repository';
import { TeamRepository } from 'src/repositories/team.repository';
import { TeamPermissionRepository } from 'src/repositories/teamPermission.repository';
import { Between, In, Like } from 'typeorm';
import { UserDataDTO } from '../auth/dto';
import { DiscordService } from '../discord/discord.service';
import { TaskLogDTO } from '../discord/dto';
import { PaginationDTO } from '../dto';
import { ColumnRepository } from './../../repositories/column.repository';
import {
  ChangeStatusTaskDTO,
  MoveTaskInAnotherColumnDTO,
  MoveTaskInTheSameColumnDTO,
  TaskDTO,
  TaskPaginationDTO,
} from './dto';
import {
  AddSubTaskDTO,
  AddTaskCommentDTO,
  AddTaskFileDTO,
  EditTaskCommentDTO,
  UpdateTaskDTO,
} from './updateTask.dto';
@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly columnRepository: ColumnRepository,
    private readonly userRepository: UserRepository,
    private readonly discordService: DiscordService,
    private readonly configService: ConfigService,
    private readonly taskCommentRepo: TaskCommentRepository,
    private readonly subTaskRepo: SubTaskRepository,
    private readonly taskFileRepo: TaskFileRepository,
    private readonly taskHistoryRepo: TaskHistoryRepository,
    private readonly teamPermissionRepo: TeamPermissionRepository,
    private readonly teamRepo: TeamRepository,
  ) {}

  FRONT_END_LINK = this.configService.get<string>('FRONT_END_LINK');

  // #region pagination reference of task
  async subTaskPagination(data: PaginationDTO) {
    const { take, skip } = data;
    if (!data.where.taskId) throw new Error('Task id not found!');
    const subTaskPagination = await this.subTaskRepo.findAndCount({
      where: {
        taskId: data.where.taskId,
        isDeleted: false,
      },
      take: data.take,
      skip: data.skip,
      order: {
        createdAt: 'DESC',
      },
    });

    const isHasNextPage = !(take * (skip / take) < subTaskPagination[1]);
    return [...subTaskPagination, isHasNextPage];
  }

  async taskFilePagination(data: PaginationDTO) {
    const { take, skip } = data;
    if (!data.where.taskId) throw new Error('Column id not found!');
    const taskFileData = await this.taskFileRepo.findAndCount({
      where: {
        taskId: data.where.taskId,
        isDeleted: false,
      },
      take: data.take,
      skip: data.skip,
      order: {
        createdAt: 'DESC',
      },
    });
    const isHasNextPage = !(take * (skip / take) < taskFileData[1]);
    return [...taskFileData, isHasNextPage];
  }

  async taskCommentPagination(data: PaginationDTO, user: UserEntity) {
    const { take, skip } = data;
    if (!data.where.taskId) throw new Error('Column id not found!');
    const taskCommentData: any = await this.taskCommentRepo.findAndCount({
      where: {
        taskId: data.where.taskId,
        isDeleted: false,
      },
      take: data.take,
      skip: data.skip,
      order: {
        createdAt: 'DESC',
      },
      relations: {
        owner: true,
      },
    });

    const res = taskCommentData[0].map((comment: any) => {
      const owner = comment.__owner__;
      const isOwner = comment.createdBy === user.id;
      delete comment.__owner__;
      return {
        ...comment,
        isOwner,
        owner,
      };
    });
    const isHasNextPage = !(take * (skip / take) < taskCommentData[1]);
    return [res, taskCommentData[1], isHasNextPage];
  }

  async taskHistoryPagination(data: PaginationDTO) {
    const { take, skip } = data;
    if (!data.where.taskId) throw new Error('Task id not found!');
    const taskHistoryData = await this.taskHistoryRepo.findAndCount({
      where: {
        taskId: data.where.taskId,
        isDeleted: false,
      },
      take: data.take,
      skip: data.skip,
      order: {
        createdAt: 'DESC',
      },
      relations: {
        owner: true,
      },
    });
    const isHasNextPage = !(take * (skip / take) < taskHistoryData[1]);

    const result = taskHistoryData[0].map((history: any) => {
      const owner = history.__owner__;
      delete history.__owner__;
      return {
        ...history,
        owner,
      };
    });
    return [result, taskHistoryData[1], isHasNextPage];
  }
  //#endregion
  // #region  update reference task task file comment sub task
  // crud sub task
  async removeSubTask(subTaskId: string, user: UserEntity) {
    return await this.taskRepository.manager.transaction(
      async (transaction) => {
        const subTaskRepo = transaction.getRepository(SubTaskEntity);
        const taskHistoryRepo = transaction.getRepository(TaskHistoryEntity);
        const taskRepo = transaction.getRepository(TaskEntity);

        const subTask: any = await subTaskRepo.findOne({
          where: { id: subTaskId, isDeleted: false },
          relations: {
            task: true,
          },
        });

        if (!subTask) {
          throw new Error('Sub task not found!');
        }

        const task = subTask.__task__;
        task.totalSubTask = task.totalSubTask - 1;
        await taskRepo.save(task);
        await subTaskRepo.delete(subTaskId);

        // create history
        const newTaskHistory = new TaskHistoryEntity();
        newTaskHistory.taskId = task.id;
        newTaskHistory.createdBy = user.id;
        newTaskHistory.createdByName = user.username;
        newTaskHistory.createdAt = new Date();
        newTaskHistory.title = 'Remove sub task';
        newTaskHistory.description =
          'User ' +
          user.username +
          ' remove sub task at ' +
          moment(new Date()).format('HH:mm:ss YYYY-MM-DD');
        newTaskHistory.ownerId = user.id;
        await taskHistoryRepo.save(newTaskHistory);

        return {
          message: 'Sub task removed successfully!',
          data: {
            newHistory: {
              ...newTaskHistory,
              owner: user,
            },
            previousSubTask: subTask,
          },
        };
      },
    );
  }
  async addSubTask(data: AddSubTaskDTO, user: UserEntity) {
    return await this.taskRepository.manager.transaction(
      async (transaction) => {
        const subTaskRepo = transaction.getRepository(SubTaskEntity);
        const taskHistoryRepo = transaction.getRepository(TaskHistoryEntity);
        const taskRepo = transaction.getRepository(TaskEntity);

        const task = await taskRepo.findOne({
          where: { id: data.taskId, isDeleted: false },
        });

        if (!task) {
          throw new Error('Task not found!');
        }

        task.totalSubTask = task.totalSubTask + 1;
        await taskRepo.save(task);

        const newSubTask = new SubTaskEntity();
        newSubTask.name = data.data.name;
        newSubTask.taskId = data.taskId;
        newSubTask.isChecked = data.data.isChecked;
        newSubTask.createdBy = user.id;
        newSubTask.createdByName = user.username;
        newSubTask.createdAt = new Date();
        await subTaskRepo.save(newSubTask);

        // create history
        const newTaskHistory = new TaskHistoryEntity();
        newTaskHistory.taskId = data.taskId;
        newTaskHistory.createdBy = user.id;
        newTaskHistory.createdByName = user.username;
        newTaskHistory.createdAt = new Date();
        newTaskHistory.title = 'Add sub task';
        newTaskHistory.description =
          'User ' +
          user.username +
          ' add sub task at ' +
          moment(new Date()).format('HH:mm:ss YYYY-MM-DD');
        newTaskHistory.ownerId = user.id;
        await taskHistoryRepo.save(newTaskHistory);

        return {
          message: 'Sub task added successfully!',
          data: {
            newSubTask: {
              ...newSubTask,
              owner: user,
            },
            newHistory: {
              ...newTaskHistory,
              owner: user,
            },
          },
        };
      },
    );
  }
  async toggleSubTask(subTaskId: string, user: UserEntity) {
    return await this.taskRepository.manager.transaction(
      async (transaction) => {
        const subTaskRepo = transaction.getRepository(SubTaskEntity);
        const taskHistoryRepo = transaction.getRepository(TaskHistoryEntity);

        const subTask: any = await subTaskRepo.findOne({
          where: { id: subTaskId, isDeleted: false },
          relations: {
            task: true,
          },
        });

        if (!subTask) {
          throw new Error('Sub task not found!');
        }

        const task = subTask.__task__;

        subTask.isChecked = !subTask.isChecked;
        await subTaskRepo.save(subTask);

        // create history
        const newTaskHistory = new TaskHistoryEntity();
        newTaskHistory.taskId = task.id;
        newTaskHistory.createdBy = user.id;
        newTaskHistory.createdByName = user.username;
        newTaskHistory.createdAt = new Date();
        newTaskHistory.title = 'Toggle sub task';
        newTaskHistory.description =
          'User ' +
          user.username +
          ' toggle sub task at ' +
          moment(new Date()).format('HH:mm:ss YYYY-MM-DD');
        newTaskHistory.ownerId = user.id;
        await taskHistoryRepo.save(newTaskHistory);

        return {
          message: 'Sub task toggled successfully!',
          data: {
            newSubTask: {
              ...subTask,
              owner: user,
            },
            newHistory: {
              ...newTaskHistory,
              owner: user,
            },
          },
        };
      },
    );
  }

  // crud task comment
  async editTaskComment(data: EditTaskCommentDTO, user: UserEntity) {
    return await this.taskRepository.manager.transaction(
      async (transaction) => {
        const taskCommentRepo = transaction.getRepository(TaskCommentEntity);
        const taskHistoryRepo = transaction.getRepository(TaskHistoryEntity);

        const taskComment: any = await taskCommentRepo.findOne({
          where: { id: data.commentId, isDeleted: false },
        });

        if (!taskComment) {
          throw new Error('Task comment not found!');
        }

        taskComment.content = data.content;
        taskComment.updatedBy = user.id;
        taskComment.updatedAt = new Date();
        await taskCommentRepo.save(taskComment);

        // create history
        const newTaskHistory = new TaskHistoryEntity();
        newTaskHistory.taskId = data.taskId;
        newTaskHistory.createdBy = user.id;
        newTaskHistory.createdByName = user.username;
        newTaskHistory.createdAt = new Date();
        newTaskHistory.title = 'Edit task comment';
        newTaskHistory.description =
          'User ' +
          user.username +
          ' edit task comment at ' +
          moment(new Date()).format('HH:mm:ss YYYY-MM-DD');
        newTaskHistory.ownerId = user.id;
        await taskHistoryRepo.save(newTaskHistory);

        return {
          message: 'Task comment edited successfully!',
          data: {
            newTaskComment: {
              ...taskComment,
              owner: user,
              isOwner: true,
            },
            newHistory: {
              ...newTaskHistory,
              owner: user,
            },
          },
        };
      },
    );
  }
  async addTaskComment(taskComment: AddTaskCommentDTO, user: UserEntity) {
    const task = await this.taskRepository.findOneBy({
      id: taskComment.taskId,
      isDeleted: false,
    });
    if (!task) {
      throw new Error('Task not found!');
    }

    return await this.taskRepository.manager.transaction(
      async (transaction) => {
        const taskCommentRepo = transaction.getRepository(TaskCommentEntity);
        const taskHistoryRepo = transaction.getRepository(TaskHistoryEntity);
        const taskRepo = transaction.getRepository(TaskEntity);

        task.totalComment = task.totalComment + 1;
        await taskRepo.save(task);

        const newTaskComment = new TaskCommentEntity();
        newTaskComment.content = taskComment.content;
        newTaskComment.taskId = taskComment.taskId;
        newTaskComment.createdBy = user.id;
        newTaskComment.createdByName = user.username;
        newTaskComment.createdAt = new Date();
        newTaskComment.userId = user.id;
        await taskCommentRepo.save(newTaskComment);

        // create history
        const newTaskHistory = new TaskHistoryEntity();
        newTaskHistory.taskId = taskComment.taskId;
        newTaskHistory.createdBy = user.id;
        newTaskHistory.createdByName = user.username;
        newTaskHistory.createdAt = new Date();
        newTaskHistory.title = 'Add task comment';
        newTaskHistory.description =
          'User ' +
          user.username +
          ' add task comment at ' +
          moment(new Date()).format('HH:mm:ss YYYY-MM-DD');
        newTaskHistory.ownerId = user.id;
        await taskHistoryRepo.save(newTaskHistory);

        return {
          message: 'Task comment added successfully!',
          data: {
            newTaskComment: {
              ...newTaskComment,
              owner: user,
              isOwner: true,
            },
            newHistory: {
              ...newTaskHistory,
              owner: user,
            },
          },
        };
      },
    );
  }
  async removeTaskComment(taskCommentId: string, user: UserEntity) {
    const taskComment: any = await this.taskCommentRepo.findOne({
      where: {
        id: taskCommentId,
        isDeleted: false,
      },
      relations: {
        task: true,
      },
    });

    if (!taskComment) {
      throw new Error('Task file not found!');
    }
    const task = taskComment.__task__;
    return await this.taskRepository.manager.transaction(
      async (transaction) => {
        const taskCommentRepo = transaction.getRepository(TaskCommentEntity);
        const taskHistoryRepo = transaction.getRepository(TaskHistoryEntity);
        const taskRepo = transaction.getRepository(TaskEntity);

        task.taskComment = task.taskComment - 1;

        await taskRepo.save(task);
        await taskCommentRepo.delete(taskCommentId);

        // create history
        const newTaskHistory = new TaskHistoryEntity();
        newTaskHistory.taskId = task.id;
        newTaskHistory.createdBy = user.id;
        newTaskHistory.createdByName = user.username;
        newTaskHistory.createdAt = new Date();
        newTaskHistory.title = 'Remove task comment';
        newTaskHistory.description =
          'User ' +
          user.username +
          ' remove task comment at ' +
          moment(new Date()).format('HH:mm:ss YYYY-MM-DD');
        newTaskHistory.ownerId = user.id;
        await taskHistoryRepo.save(newTaskHistory);

        return {
          message: 'Task comment removed successfully!',
          data: {
            newHistory: {
              ...newTaskHistory,
              owner: user,
            },
            previousTaskComment: taskComment,
          },
        };
      },
    );
  }
  // crud task file

  async removeTaskFile(taskFileId: string, user: UserEntity) {
    const taskFile: any = await this.taskFileRepo.findOne({
      where: {
        id: taskFileId,
        isDeleted: false,
      },
      relations: {
        task: true,
      },
    });

    if (!taskFile) {
      throw new Error('Task file not found!');
    }
    const task = taskFile.__task__;

    return await this.taskRepository.manager.transaction(
      async (transaction) => {
        const taskFileRepo = transaction.getRepository(TaskFileEntity);
        const taskHistoryRepo = transaction.getRepository(TaskHistoryEntity);
        const taskRepo = transaction.getRepository(TaskEntity);
        task.totalTaskFile = task.totalTaskFile - 1;

        await taskRepo.save(task);

        await taskFileRepo.delete(taskFileId);

        // create history
        const newTaskHistory = new TaskHistoryEntity();
        newTaskHistory.taskId = task.id;
        newTaskHistory.createdBy = user.id;
        newTaskHistory.createdByName = user.username;
        newTaskHistory.createdAt = new Date();
        newTaskHistory.title = 'Remove task file';
        newTaskHistory.description =
          'User ' +
          user.username +
          ' remove task file at ' +
          moment(new Date()).format('HH:mm:ss YYYY-MM-DD');
        newTaskHistory.ownerId = user.id;
        await taskHistoryRepo.save(newTaskHistory);

        return {
          message: 'Task file removed successfully!',
          data: {
            newHistory: {
              ...newTaskHistory,
              owner: user,
            },
            previousTaskFile: taskFile,
          },
        };
      },
    );
  }

  async addTaskFile(taskFile: AddTaskFileDTO, user: UserEntity) {
    const task = await this.taskRepository.findOneBy({
      id: taskFile.taskId,
      isDeleted: false,
    });

    if (!task) {
      throw new Error('Task not found!');
    }

    return await this.taskRepository.manager.transaction(
      async (transaction) => {
        const taskFileRepo = transaction.getRepository(TaskFileEntity);
        const taskHistoryRepo = transaction.getRepository(TaskHistoryEntity);
        const taskRepo = transaction.getRepository(TaskEntity);

        task.totalTaskFile = task.totalTaskFile + 1;
        await taskRepo.save(task);

        const newTaskFile = new TaskFileEntity();
        newTaskFile.fileLink = taskFile.data.fileLink;
        newTaskFile.taskId = task.id;
        newTaskFile.createdBy = user.id;
        newTaskFile.createdByName = user.username;
        newTaskFile.createdAt = new Date();
        newTaskFile.name = taskFile.data.name;
        await taskFileRepo.save(newTaskFile);

        // create history
        const newTaskHistory = new TaskHistoryEntity();
        newTaskHistory.taskId = task.id;
        newTaskHistory.createdBy = user.id;
        newTaskHistory.createdByName = user.username;
        newTaskHistory.createdAt = new Date();
        newTaskHistory.title = 'Add task file';
        newTaskHistory.description =
          'User ' +
          user.username +
          ' add task file at ' +
          moment(new Date()).format('HH:mm:ss YYYY-MM-DD');
        newTaskHistory.ownerId = user.id;
        await taskHistoryRepo.save(newTaskHistory);

        return {
          message: 'Task file added successfully!',
          data: {
            newTaskFile: {
              ...newTaskFile,
              owner: user,
            },
            newHistory: {
              ...newTaskHistory,
              owner: user,
            },
          },
        };
      },
    );
  }
  // #endregion

  //#region  update task
  async update(updateTaskDto: UpdateTaskDTO, user: UserEntity) {
    return await this.taskRepository.manager.transaction(
      async (transaction) => {
        const taskRepo = transaction.getRepository(TaskEntity);
        const taskHistoryRepo = transaction.getRepository(TaskHistoryEntity);

        const task: any = await taskRepo.findOne({
          where: { id: updateTaskDto.id, isDeleted: false },
          relations: {
            lstPersonInCharge: true,
            column: {
              team: true,
            },
          },
        });
        const lstPersonInCharge = task.__lstPersonInCharge__;
        delete task.__lstPersonInCharge__;
        const columnOfStatus = await this.columnRepository.findOneBy({
          isDeleted: false,
          statusCode: updateTaskDto.status,
          team: {
            id: task.__column__.__team__.id,
          },
        });

        delete task.__column__;
        if (!task) throw new Error('Task not found!');

        // check user permission
        const checkPermission = lstPersonInCharge.find(
          (us: any) => us.id === user.id,
        );
        if (!checkPermission && task.createdBy !== user.id)
          throw new Error('Permission denied!');

        let prevStatus = '';
        if (updateTaskDto.status && columnOfStatus) {
          prevStatus = task.status;
          task.status = updateTaskDto.status;
          task.columnId = columnOfStatus.id;
        }

        // check if user is owner of task then can edit all field
        const isCheckCanEditFiled =
          updateTaskDto.title ||
          updateTaskDto.description ||
          updateTaskDto.expireDate ||
          updateTaskDto.priority ||
          updateTaskDto.type ||
          updateTaskDto.members;

        if (isCheckCanEditFiled && task.createdBy !== user.id) {
          throw new Error(
            'Permission denied! Just owner can edit these filled in task!',
          );
        }
        if (updateTaskDto.title) task.title = updateTaskDto.title;
        if (updateTaskDto.description)
          task.description = updateTaskDto.description;
        if (updateTaskDto.expireDate)
          task.expireDate = updateTaskDto.expireDate;
        if (updateTaskDto.priority) task.priority = updateTaskDto.priority;
        if (updateTaskDto.type) task.type = updateTaskDto.type;
        if (updateTaskDto.members) {
          const lstPersonInCharge = await this.userRepository.find({
            where: {
              id: In([...updateTaskDto.members]),
              isDeleted: false,
            },
          });
          task.lstPersonInCharge = Promise.resolve(lstPersonInCharge);
        }

        task.updatedBy = user.id;
        task.updatedAt = new Date();

        // #region  add task history
        const newTaskHistory = new TaskHistoryEntity();
        newTaskHistory.taskId = task.id;
        newTaskHistory.createdBy = user.id;
        newTaskHistory.createdByName = user.username;
        newTaskHistory.createdAt = new Date();
        newTaskHistory.title = columnOfStatus
          ? 'Change task status'
          : 'Update task';

        if (columnOfStatus) {
          newTaskHistory.description =
            'User [' +
            user.username +
            '] move task + [' +
            task.title +
            ' ]' +
            'from [' +
            prevStatus.toUpperCase() +
            '] to [' +
            columnOfStatus.statusCode.toUpperCase() +
            '] ' +
            moment(new Date()).format('HH:mm:ss YYYY-MM-DD');
        } else {
          newTaskHistory.description =
            'User [' +
            user.username +
            '] update task [' +
            task.name +
            '] ' +
            moment(new Date()).format('HH:mm:ss YYYY-MM-DD');
        }
        newTaskHistory.ownerId = user.id;

        await taskHistoryRepo.save(newTaskHistory);
        // #endregion
        await taskRepo.save(task);

        return {
          message: 'Task updated successfully!',
        };
      },
    );
  }

  //#endregion
  //#region  find detail task
  async detail(id: string, user: UserEntity) {
    const task: any = await this.taskRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
      relations: {
        lstPersonInCharge: true,
        column: {
          team: true,
        },
      },
    });

    const teamPermission = await this.teamPermissionRepo.findOneBy({
      team: {
        id: task.__column__.__team__.id,
      },
      userId: user.id,
      isDeleted: false,
    });

    if (!teamPermission) throw new Error('Permission denied!');

    const checkPermission = task?.__lstPersonInCharge__.find(
      (us: any) => us.id === user.id,
    );

    const isOwnerOfTeam = task?.__column__?.__team__?.createdBy === user.id;

    if (!task) throw new NotFoundException('Task not found!');

    if (
      !checkPermission &&
      task.createdBy !== user.id &&
      !isOwnerOfTeam &&
      !teamPermission.isAdmin
    )
      throw new Error('Permission denied!');

    const statusOfTask = coreHelper.getStatusOfTask(task.status);
    const priorityOfTask = coreHelper.getPriorityOfTask(task.priority);
    const typeOfTask = coreHelper.getTypeOfTask(task.type);

    const lstPersonInCharge = task.__lstPersonInCharge__;

    const res = {
      ...task,
      statusName: statusOfTask?.name,
      statusColor: statusOfTask?.color,
      statusBackground: statusOfTask?.background,
      priorityName: priorityOfTask?.name,
      priorityColor: priorityOfTask?.color,
      priorityBackground: priorityOfTask?.background,
      typeName: typeOfTask?.name,
      typeColor: typeOfTask?.color,
      type: typeOfTask,
      priority: priorityOfTask,
      status: statusOfTask,
      typeBackground: typeOfTask?.background,
      lstPersonInCharge,
      members: lstPersonInCharge,
      isOwner: task.createdBy === user.id,
    };

    delete res.__lstPersonInCharge__;

    return res;
  }
  //#endregion
  async pagination(
    taskPaginationDTO: PaginationDTO<TaskPaginationDTO>,
    user: UserEntity,
  ) {
    const { status, teamId, columnId, userId, teamMemberId, search } =
      taskPaginationDTO.where;

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
      where: [
        {
          ...whereCon,
          isDeleted: false,
          lstPersonInCharge: {
            id: In([user.id]),
          },
        },
        { ...whereCon, isDeleted: false, createdBy: user.id },
        {
          ...whereCon,
          isDeleted: false,
          column: { team: { createdBy: user.id } },
        },
      ],
      order: { index: 'ASC' },
      relations: {
        lstPersonInCharge: true,
      },
      skip: taskPaginationDTO.skip,
      take: taskPaginationDTO.take,
    });

    const resultTask = await Promise.all(
      tasks[0].map(async (task: any) => {
        const lstPersonInCharge = task.__lstPersonInCharge__;
        delete task.__lstPersonInCharge__;
        const statusOfTask = coreHelper.getStatusOfTask(task.status);
        const priorityOfTask = coreHelper.getPriorityOfTask(task.priority);
        const typeOfTask = coreHelper.getTypeOfTask(task.type);
        const isOwner = task.createdBy === user.id;

        return {
          members: lstPersonInCharge,
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
          isOwner,
        };
      }),
    );

    return [resultTask, tasks[1]];
  }

  async create(taskDTO: TaskDTO, user: UserDataDTO) {
    return await this.taskRepository.manager.transaction(
      async (transaction) => {
        const taskRepo = transaction.getRepository(TaskEntity);
        const taskCommentRepo = transaction.getRepository(TaskCommentEntity);
        const taskFileRepo = transaction.getRepository(TaskFileEntity);
        const taskHistoryRepo = transaction.getRepository(TaskHistoryEntity);
        const teamHistoryRepo = transaction.getRepository(TeamHistoryEntity);
        const subTaskRepo = transaction.getRepository(SubTaskEntity);
        const columnRepo = transaction.getRepository(ColumnEntity);
        const column: any = await columnRepo.findOne({
          where: { id: taskDTO.columnId },
          relations: { tasks: true, team: true },
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

        const totalTaskToday = await this.taskRepository.count({
          where: {
            createdAt: Between(
              moment(new Date()).startOf('day').toDate(),
              moment(new Date()).endOf('day').toDate(),
            ),
            column: {
              team: {
                id: column.__team__.id,
              },
            },
          },
        });

        //#region  create new task
        const newIndexTask = column.__tasks__.length + 1;
        const newTask = new TaskEntity();
        const totalTaskTodayPadded = String(totalTaskToday + 1).padStart(
          4,
          '0',
        );
        const genCode = 'TASK_' + totalTaskTodayPadded;

        newTask.code = genCode;
        newTask.index = newIndexTask;
        newTask.priority = taskDTO.priority;
        newTask.type = taskDTO.type;
        newTask.title = taskDTO.title;
        newTask.description = taskDTO.description;
        newTask.sourceCodeLink = taskDTO.sourceCodeLink;
        newTask.columnId = taskDTO.columnId;
        newTask.lstPersonInCharge = Promise.resolve(lstPersonInCharge);
        newTask.createdBy = user.id;
        newTask.createdByName = user.username;
        newTask.createdAt = new Date();
        newTask.expireDate = taskDTO.expireDate;
        newTask.cmdCheckOutBranch = `git checkout -b ${taskDTO.title}`;
        newTask.cmdCommit = `git commit -m "feature: ${taskDTO.title}"`;
        newTask.status = column.statusCode;
        newTask.totalComment = taskDTO.comments.length;
        newTask.totalSubTask = taskDTO.subTasks.length;
        newTask.totalTaskFile = taskDTO.taskFile.length;

        await taskRepo.save(newTask);
        //#endregion

        //#region  add task comment
        for (const comment of taskDTO.comments) {
          const newComment = new TaskCommentEntity();
          newComment.content = comment.content;
          newComment.userId = user.id;
          newComment.taskId = newTask.id;
          newComment.createdBy = user.id;
          newComment.createdByName = user.username;
          newComment.createdAt = new Date();
          newComment.userId = comment.ownerId;
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
          newFile.name = file.name;
          await taskFileRepo.save(newFile);
        }
        //#endregion

        //#region  add task history
        const newTaskHistory = new TaskHistoryEntity();
        newTaskHistory.taskId = newTask.id;
        newTaskHistory.createdBy = user.id;
        newTaskHistory.createdByName = user.username;
        newTaskHistory.createdAt = new Date();
        newTaskHistory.title = 'Create new task';
        newTaskHistory.description =
          'User ' +
          user.username +
          ' create new task at ' +
          moment(new Date()).format('HH:mm:ss YYYY-MM-DD');
        newTaskHistory.ownerId = user.id;
        await taskHistoryRepo.save(newTaskHistory);
        //#endregion

        /// create history
        const history = new TeamHistoryEntity();
        history.title = 'Create new task';
        history.description =
          'User ' +
          user.username +
          ' create new task at ' +
          moment(new Date()).format('HH:mm:ss YYYY-MM-DD');
        history.teamId = column.__team__.id;
        history.ownerId = user.id;
        history.createdAt = new Date();
        history.createdBy = user.id;
        history.createdByName = user.username;
        history.createdBy = user.id;
        history.createdByName = user.username;
        await teamHistoryRepo.save(history);

        //#region  log to discord
        const taskLog: TaskLogDTO = {
          taskName: newTask.title,
          memberName: user.userDetail?.fullName || user.username,
          link: this.FRONT_END_LINK + '/tasks/' + newTask.id,
          statusName: newTask.status,
          message:
            user.userDetail?.fullName ||
            user.username +
              ' create new task at ' +
              moment(new Date()).format('HH:mm:ss YYYY-MM-DD'),
          timeString: moment(new Date()).format('HH:mm:ss YYYY-MM-DD'),
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
        const statusOfTask = coreHelper.getStatusOfTask(taskDetail.status);
        const priorityOfTask = coreHelper.getPriorityOfTask(
          taskDetail.priority,
        );
        const typeOfTask = coreHelper.getTypeOfTask(taskDetail.type);
        return {
          message: 'Task created successfully',
          data: {
            ...taskDetail,
            lstMember,
            statusName: statusOfTask?.name,
            statusColor: statusOfTask?.color,
            statusBackground: statusOfTask?.background,
            priorityName: priorityOfTask?.name,
            priorityColor: priorityOfTask?.color,
            priorityBackground: priorityOfTask?.background,
            typeName: typeOfTask?.name,
            typeColor: typeOfTask?.color,
            typeBackground: typeOfTask?.background,
            totalComment: taskDTO.comments.length,
            totalTaskFile: taskDTO.taskFile.length,
            totalSubTask: taskDTO.subTasks.length,
          },
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
    const { taskId, columnIdTo } = moveTaskDTO;

    const task = await this.taskRepository.findOneBy({
      id: taskId,
      isDeleted: false,
    });
    if (!task) {
      throw new Error('Task not found!');
    }
    task.columnId = columnIdTo;

    // Retrieve the target column (where the task will be moved to)
    const columnTo = await this.columnRepository.findOneBy({ id: columnIdTo });
    if (!columnTo) {
      throw new NotFoundException('Column not found!');
    }

    // Efficiently update task indices using a single transaction
    await this.taskRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const taskRepo = transactionalEntityManager.getRepository(TaskEntity);
        const taskHistoryRepo =
          transactionalEntityManager.getRepository(TaskHistoryEntity);
        const prevStatus = task.status;
        task.status = columnTo.statusCode;
        await taskRepo.save(task);

        const newTaskHistory = new TaskHistoryEntity();
        newTaskHistory.taskId = task.id;
        newTaskHistory.createdBy = user.id;
        newTaskHistory.createdByName = user.username;
        newTaskHistory.createdAt = new Date();
        newTaskHistory.ownerId = user.id;
        newTaskHistory.title = columnTo ? 'Change task status' : 'Update task';

        newTaskHistory.description =
          'User [' +
          user.username +
          '] move task + [' +
          task.title +
          ' ]' +
          'from [' +
          prevStatus.toUpperCase() +
          '] to [' +
          columnTo.statusCode.toUpperCase() +
          '] ' +
          moment(new Date()).format('HH:mm:ss YYYY-MM-DD');

        await taskHistoryRepo.save(newTaskHistory);

        const taskLog: TaskLogDTO = {
          taskName: task.title,
          memberName: user.userDetail?.fullName || user.username,
          link: this.FRONT_END_LINK + '/tasks/' + task.id,
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
        return {
          message: 'Task moved successfully!',
        };
      },
    );

    // Get the status name of the target column
    const statusNameTo =
      enumData.taskStatus[
        columnTo.statusCode as keyof typeof enumData.taskStatus
      ].name;

    return {
      message: `${task.title} moved to ${statusNameTo}`,
    };
  }

  async deleteSoft(taskId: string, user: UserEntity) {
    const task = await this.taskRepository.findOneBy({
      id: taskId,
      isDeleted: false,
    });
    if (!task) {
      throw new Error('Task not found!');
    }
    if (task?.createdBy !== user.id) {
      throw new Error('Permission denied!');
    }
    task.isDeleted = true;
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
