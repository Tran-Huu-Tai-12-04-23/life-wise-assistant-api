import { Injectable } from '@nestjs/common';
import { ColumnEntity } from 'src/entities/column.entity';
import { ColumnDTO } from './dto';
import { UserEntity } from 'src/entities';
import { ColumnRepository } from 'src/repositories';
import { TeamRepository } from 'src/repositories/team.repository';

@Injectable()
export class ColumnService {
  constructor(
    private readonly columnRepository: ColumnRepository,
    private readonly teamRepository: TeamRepository,
  ) {}
  async create(columnDTO: ColumnDTO, user: UserEntity) {
    const existCol = await this.columnRepository.findOne({
      where: { name: columnDTO.name },
    });
    if (existCol) {
      throw new Error('Column already exists!');
    }
    const team = this.teamRepository.findOneBy({ id: columnDTO.teamId });
    if (team != null) {
      throw new Error('Team not found!');
    }
    const newCol = new ColumnEntity();
    newCol.name = columnDTO.name;
    newCol.team = Promise.resolve(team);
    newCol.createdBy = user.id;
    return await this.columnRepository.insert(newCol);
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

  async getAll(teamId: string) {
    const columns = await this.columnRepository.find({
      where: { team: { id: teamId }, isDeleted: false },
    });
    return columns;
  }
}
