import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ColumnEntity } from 'src/entities/column.entity';
import { ColumnDTO, GetAllColumnsDTO, SwapColDTO } from './dto';
import { UserEntity } from 'src/entities';
import { ColumnRepository, TaskRepository } from 'src/repositories';
import { TeamRepository } from 'src/repositories/team.repository';
import { Between, In, Like } from 'typeorm';

@Injectable()
export class ColumnService {
  constructor(
    private readonly columnRepository: ColumnRepository,
    private readonly teamRepository: TeamRepository,
    private readonly taskRepository: TaskRepository,
  ) {}
  async create(columnDTO: ColumnDTO, user: UserEntity) {
    const existCol = await this.columnRepository.findOne({
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
    newCol.index = team.__columns__.length + 1;

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

    // Check user permission (same as before)

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
      )!;
      if (!currentColumn) {
        throw new NotFoundException('Column not found!');
      }
      affectedColumns.forEach((column) => {
        if (column !== currentColumn) {
          column.index = column.index + 1;
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

    const columns: any = await this.columnRepository.find({
      where,
      order: { index: 'ASC' },
    });

    const whereForTask: any = {};
    if (getAllColumnDTO.status) {
      whereForTask.status = Like(`%${getAllColumnDTO.status}%`);
    }
    if (getAllColumnDTO.searchKey) {
      whereForTask.title = Like(`%${getAllColumnDTO.searchKey}%`);
    }
    if (
      getAllColumnDTO.lstPersonInCharge &&
      getAllColumnDTO.lstPersonInCharge.length > 0
    ) {
      whereForTask.lstPersonInCharge = {
        id: In(getAllColumnDTO.lstPersonInCharge),
      };
    }

    const res = await Promise.all(
      columns.map(async (col: any) => {
        const tasks = await this.taskRepository.find({
          where: { ...whereForTask, isDeleted: false, column: { id: col.id } },
          relations: { lstPersonInCharge: true },
          order: { index: 'ASC' },
        });
        return {
          ...col,
          tasks: tasks.map((tas: any) => {
            const members = tas.__lstPersonInCharge__;
            delete tas.__lstPersonInCharge__;
            return { ...tas, lstMember: members };
          }),
        };
      }),
    );

    return res;
  }
}
