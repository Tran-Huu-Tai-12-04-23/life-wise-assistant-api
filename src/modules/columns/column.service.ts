import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { enumData } from 'src/constants/enum-data';
import { UserEntity } from 'src/entities';
import { ColumnEntity } from 'src/entities/column.entity';
import { coreHelper } from 'src/helpers';
import {
  ColumnRepository,
  TaskCommentRepository,
  TaskRepository,
} from 'src/repositories';
import { SubTaskRepository } from 'src/repositories/subTask.repository';
import { TaskFileRepository } from 'src/repositories/taskFile.repository';
import { TeamRepository } from 'src/repositories/team.repository';
import { Between, In, Like } from 'typeorm';
import {
  ColumnDTO,
  GetAllColumnsDTO,
  GetDataToFilterDTO,
  SwapColDTO,
} from './dto';
@Injectable()
export class ColumnService {
  constructor(
    private readonly columnRepository: ColumnRepository,
    private readonly teamRepository: TeamRepository,
    private readonly taskRepository: TaskRepository,
    private readonly taskCommentRepo: TaskCommentRepository,
    private readonly subTaskRepo: SubTaskRepository,
    private readonly taskFileRepo: TaskFileRepository,
  ) {}
  async getDataToFIlter(getDataToFilter: GetDataToFilterDTO) {
    const columns = await this.columnRepository.find({
      where: {
        team: { id: getDataToFilter.teamId },
        isDeleted: false,
      },
      order: { index: 'ASC' },
    });

    const lstStatus = columns.map(
      (item) => enumData.taskStatus[item.statusCode as 'PENDING'],
    );
    return {
      lstStatus,
    };
  }
  async create(
    columnDTO: ColumnDTO,
    user: UserEntity,
    repo?: ColumnRepository,
  ) {
    const mainRepo = repo || this.columnRepository;
    const existCol = await mainRepo.findOne({
      where: { name: columnDTO.name, team: { id: columnDTO.teamId } },
    });
    if (existCol) {
      throw new HttpException('Column already exists!', HttpStatus.BAD_REQUEST);
    }
    const team: any = await this.teamRepository.findOne({
      where: { id: columnDTO.teamId },
      relations: {
        columns: true,
      },
    });
    if (!team) {
      throw new HttpException('Team not found!', HttpStatus.NOT_FOUND);
    }

    const exitsColWithStatus = await this.columnRepository.findOne({
      where: {
        name: columnDTO.name,
        team: { id: columnDTO.teamId },
        statusCode: columnDTO.statusCode,
      },
    });
    if (exitsColWithStatus)
      throw new HttpException(
        'Column with status already exists!',
        HttpStatus.BAD_REQUEST,
      );
    const newCol = new ColumnEntity();
    newCol.name = columnDTO.name;
    newCol.team = Promise.resolve(team);
    newCol.createdBy = user.id;
    newCol.createdByName = user.username;
    newCol.statusCode = columnDTO.statusCode;
    newCol.index = columnDTO?.index || team.__columns__.length + 1;

    const res = await this.columnRepository.insert(newCol);

    const columnData: any = await this.columnRepository.findOne({
      where: { id: res.identifiers[0].id },
      relations: { tasks: true },
    });
    const taskOfColumn = columnData.__tasks__;
    delete columnData.__tasks__;
    return {
      message: 'Column created successfully',
      data: { ...columnData, tasks: taskOfColumn },
    };
  }

  // move task in the same column and in the same team
  async swapCol(swapColDTO: SwapColDTO) {
    const colCurrentIndex = swapColDTO.colCurrentIndex;
    const colTargetIndex = swapColDTO.colTargetIndex;

    // Fetch tasks in the affected range (inclusive)
    const affectedColumns = await this.columnRepository.find({
      where: {
        index:
          colCurrentIndex < colTargetIndex
            ? Between(colCurrentIndex, colTargetIndex)
            : Between(colTargetIndex, colCurrentIndex),
      },
      order: { index: 'ASC' },
    });

    // Efficiently update task indices using a single transaction
    await this.columnRepository.manager.transaction(async (transaction) => {
      const currentColumn = affectedColumns.find(
        (col) => col.index === colCurrentIndex,
      );
      if (!currentColumn) {
        throw new NotFoundException('Column not found!');
      }
      affectedColumns.forEach((column) => {
        if (column !== currentColumn && colCurrentIndex > colTargetIndex) {
          column.index = column.index + 1;
        } else if (
          column !== currentColumn &&
          colCurrentIndex < colTargetIndex
        ) {
          column.index = column.index - 1;
        } else {
          column.index = colTargetIndex;
        }
      });

      await transaction.save(affectedColumns);
    });

    return {
      message: 'Column moved successfully!',
    };
  }

  async update(id: string, columnDTO: ColumnDTO, user: UserEntity) {
    const column = await this.columnRepository.findOneBy({ id });
    if (column == null) {
      throw new Error('Column not found!');
    }
    column.name = columnDTO.name;
    column.updatedBy = user.id;
    return await this.columnRepository.save(column);
  }

  async delete(id: string) {
    const column = await this.columnRepository.findOneBy({ id });
    if (column == null) {
      throw new Error('Column not found!');
    }
    return await this.columnRepository.remove(column);
  }

  async getAll(getAllColumnDTO: GetAllColumnsDTO) {
    const team = await this.teamRepository.findOneBy({
      id: getAllColumnDTO.teamId,
    });
    if (!team) {
      throw new BadRequestException('Team not found!');
    }

    const where: any = {};
    where.team = { id: getAllColumnDTO.teamId };
    where.isDeleted = false;
    if (getAllColumnDTO.lstStatus && getAllColumnDTO.lstStatus.length > 0) {
      where.statusCode = In([...getAllColumnDTO.lstStatus]);
    }
    const columns: any = await this.columnRepository.find({
      where,
      order: { index: 'ASC' },
    });

    const whereForTask: any = {};
    if (getAllColumnDTO.lstStatus && getAllColumnDTO.lstStatus.length > 0) {
      whereForTask.status = In([...getAllColumnDTO.lstStatus]);
    }
    if (getAllColumnDTO.searchKey) {
      whereForTask.title = Like(`%${getAllColumnDTO.searchKey}%`);
    }
    if (getAllColumnDTO.members && getAllColumnDTO.members.length > 0) {
      whereForTask.lstPersonInCharge = {
        id: In(getAllColumnDTO.members),
      };
    }

    const res = await Promise.all(
      columns.map(async (col: any) => {
        const tasks = await this.taskRepository.find({
          where: { ...whereForTask, isDeleted: false, column: { id: col.id } },
          relations: { lstPersonInCharge: true },
          order: { index: 'ASC' },
        });
        const color =
          enumData.taskStatus[col.statusCode as 'PENDING']?.color || '#ccc';
        const background =
          enumData.taskStatus[col.statusCode as 'PENDING']?.background ||
          'rgba(0,0,0,0.1)';
        return {
          ...col,
          color,
          background,
          tasks: await Promise.all(
            tasks.map(async (tas: any) => {
              const [totalComment, totalTaskFile, totalSubTask] =
                await Promise.all([
                  this.taskCommentRepo.count({
                    where: {
                      isDeleted: false,
                      taskId: tas.id,
                    },
                  }),
                  this.taskFileRepo.count({
                    where: {
                      isDeleted: false,
                      taskId: tas.id,
                    },
                  }),
                  this.subTaskRepo.count({
                    where: {
                      isDeleted: false,
                      taskId: tas.id,
                    },
                  }),
                ]);
              const lstMember = tas.__lstPersonInCharge__;
              delete tas.__lstPersonInCharge__;
              const statusOfTask = coreHelper.getStatusOfTask(tas.status);
              const priorityOfTask = coreHelper.getPriorityOfTask(tas.priority);
              const typeOfTask = coreHelper.getTypeOfTask(tas.type);
              return {
                ...tas,
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
                totalComment,
                totalTaskFile,
                totalSubTask,
              };
            }),
          ),
        };
      }),
    );

    return res;
  }

  async resetTask() {
    const cols: any[] = await this.columnRepository.find({
      where: {},
      relations: {
        tasks: true,
      },
    });

    await this.taskRepository.manager.transaction(async (tm) => {
      for (const col of cols) {
        let index = 1;
        const lstTasks = col.__tasks__;
        for (const task of lstTasks) {
          task.index = index;
          await tm.save(task);
          index++;
        }
      }
    });

    return { message: 'Successfully!' };
  }
}
