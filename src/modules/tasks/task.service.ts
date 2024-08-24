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
import { coreHelper } from 'src/helpers';
import {
  TaskCommentRepository,
  TaskRepository,
  UserRepository,
} from 'src/repositories';
import { SubTaskRepository } from 'src/repositories/subTask.repository';
import { TaskFileRepository } from 'src/repositories/taskFile.repository';
import { Between, In, Like, MoreThan } from 'typeorm';
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
  ) {}

  FRONT_END_LINK = this.configService.get<string>('FRONT_END_LINK');

  // #region pagination reference of task
  async subTaskPagination(data: PaginationDTO) {
    if (!data.where.taskId) throw new Error('Task id not found!');
    const subTaskPagination = await this.subTaskRepo.find({
      where: {
        taskId: data.where.taskId,
        isDeleted: false,
      },
      take: data.take,
      skip: data.skip,
    });

    return subTaskPagination;
  }

  async taskFilePagination(data: PaginationDTO) {
    if (!data.where.taskId) throw new Error('Column id not found!');
    const taskFileData = await this.taskFileRepo.find({
      where: {
        taskId: data.where.taskId,
        isDeleted: false,
      },
      take: data.take,
      skip: data.skip,
    });

    return taskFileData;
  }

  async taskCommentPagination(data: PaginationDTO) {
    if (!data.where.taskId) throw new Error('Column id not found!');
    const taskCommentData = await this.taskCommentRepo.find({
      where: {
        taskId: data.where.taskId,
        isDeleted: false,
      },
      take: data.take,
      skip: data.skip,
    });
    return taskCommentData;
  }

  async taskHistoryPagination(data: PaginationDTO) {
    if (!data.where.taskId) throw new Error('Task id not found!');
    const taskHistoryData = await this.taskCommentRepo.find({
      where: {
        taskId: data.where.taskId,
        isDeleted: false,
      },
      take: data.take,
      skip: data.skip,
    });
    return taskHistoryData;
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
        newTaskHistory.taskId = subTaskId;
        newTaskHistory.createdBy = user.id;
        newTaskHistory.createdByName = user.username;
        newTaskHistory.createdAt = new Date();
        newTaskHistory.title = 'Remove sub task';
        newTaskHistory.description =
          'User ' +
          user.username +
          ' remove sub task at ' +
          moment(new Date()).format('HH:mm:ss YYYY-MM-DD');
        await taskHistoryRepo.save(newTaskHistory);
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
        await taskHistoryRepo.save(newTaskHistory);

        return {
          message: 'Sub task added successfully!',
          data: {
            newSubTask: newSubTask,
            newHistory: newTaskHistory,
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
        });

        if (!subTask) {
          throw new Error('Sub task not found!');
        }

        subTask.isChecked = !subTask.isChecked;
        await subTaskRepo.save(subTask);

        // create history
        const newTaskHistory = new TaskHistoryEntity();
        newTaskHistory.taskId = subTaskId;
        newTaskHistory.createdBy = user.id;
        newTaskHistory.createdByName = user.username;
        newTaskHistory.createdAt = new Date();
        newTaskHistory.title = 'Toggle sub task';
        newTaskHistory.description =
          'User ' +
          user.username +
          ' toggle sub task at ' +
          moment(new Date()).format('HH:mm:ss YYYY-MM-DD');
        await taskHistoryRepo.save(newTaskHistory);

        return {
          message: 'Sub task toggled successfully!',
          data: {
            newSubTask: subTask,
            newHistory: newTaskHistory,
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
        await taskHistoryRepo.save(newTaskHistory);
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
        await taskHistoryRepo.save(newTaskHistory);

        return {
          message: 'Task comment added successfully!',
          data: {
            newTaskComment: newTaskComment,
            newHistory: newTaskHistory,
          },
        };
      },
    );
  }
  async removeTaskComment(taskCommentId: string, user: UserEntity) {
    const taskFile: any = await this.taskCommentRepo.findOne({
      where: {
        id: taskCommentId,
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
        const taskCommentRepo = transaction.getRepository(TaskCommentEntity);
        const taskHistoryRepo = transaction.getRepository(TaskHistoryEntity);
        const taskRepo = transaction.getRepository(TaskEntity);

        task.taskComment = task.taskComment - 1;

        await taskRepo.save(task);
        await taskCommentRepo.delete(taskCommentId);

        // create history
        const newTaskHistory = new TaskHistoryEntity();
        newTaskHistory.taskId = taskCommentId;
        newTaskHistory.createdBy = user.id;
        newTaskHistory.createdByName = user.username;
        newTaskHistory.createdAt = new Date();
        newTaskHistory.title = 'Remove task comment';
        newTaskHistory.description =
          'User ' +
          user.username +
          ' remove task comment at ' +
          moment(new Date()).format('HH:mm:ss YYYY-MM-DD');
        await taskHistoryRepo.save(newTaskHistory);

        return {
          message: 'Task comment removed successfully!',
          newHistory: newTaskHistory,
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
        newTaskHistory.taskId = taskFileId;
        newTaskHistory.createdBy = user.id;
        newTaskHistory.createdByName = user.username;
        newTaskHistory.createdAt = new Date();
        newTaskHistory.title = 'Remove task file';
        newTaskHistory.description =
          'User ' +
          user.username +
          ' remove task file at ' +
          moment(new Date()).format('HH:mm:ss YYYY-MM-DD');
        await taskHistoryRepo.save(newTaskHistory);

        return {
          message: 'Task file removed successfully!',
          newHistory: newTaskHistory,
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
        await taskHistoryRepo.save(newTaskHistory);

        return {
          message: 'Task file added successfully!',
          data: {
            newTaskFile: newTaskFile,
            newHistory: newTaskHistory,
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
          },
        });
        const lstPersonInCharge = task.__lstPersonInCharge__;
        delete task.__lstPersonInCharge__;

        if (!task) throw new Error('Task not found!');

        // check user permission
        const checkPermission = lstPersonInCharge.find(
          (us: any) => us.id === user.id,
        );
        if (!checkPermission && task.createdBy !== user.id)
          throw new Error('Permission denied!');

        if (updateTaskDto.status) {
          task.status = updateTaskDto.status;
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
        newTaskHistory.title = 'Update task';
        newTaskHistory.description =
          'User ' +
          user.username +
          ' update task at ' +
          moment(new Date()).format('HH:mm:ss YYYY-MM-DD');

        await taskHistoryRepo.save(newTaskHistory);
        // #endregion
        await taskRepo.update(task.id, task);

        return {
          message: 'Task updated successfully!',
        };
      },
    );
  }

  //#endregion
  //#region  find detail task
  async detail(id: string, teamId: string, user: UserEntity) {
    const task: any = await this.taskRepository.findOne({
      where: {
        id,
        column: {
          team: {
            id: teamId,
          },
        },
        isDeleted: false,
      },
      relations: {
        lstPersonInCharge: true,
        taskFiles: true,
        subTasks: true,
        history: true,
        comments: {
          owner: true,
        },
      },
    });

    const checkPermission = task?.__lstPersonInCharge__.find(
      (us: any) => us.id === user.id,
    );

    if (!checkPermission && task.createdBy !== user.id)
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
      totalComment: task.__taskComments__?.length,
      totalSubTask: task.__subTasks__?.length,
      comments: task.__comments__.map((comment: any) => {
        return {
          ...comment,
          owner: comment.owner,
        };
      }),
      subTask: task.__subTasks__,
      history: task.__history__?.map((his: any) => {
        const owner = lstPersonInCharge?.find(
          (user: any) => user.id === his.createdBy,
        );
        return {
          ...his,
          owner,
        };
      }),
      taskFile: task.__taskFiles__,
    };

    delete res.__lstPersonInCharge__;
    delete res.__comments__;
    delete res.__subTasks__;
    delete res.__history__;
    delete res.__taskFiles__;

    return res;
  }
  //#endregion
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

    const resultTask = tasks[0].map(async (task: any) => {
      const lstPersonInCharge = task.__lstPersonInCharge__;
      delete task.__lstPersonInCharge__;
      const statusOfTask = coreHelper.getStatusOfTask(task.status);
      const priorityOfTask = coreHelper.getPriorityOfTask(task.priority);
      const typeOfTask = coreHelper.getTypeOfTask(task.type);
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
