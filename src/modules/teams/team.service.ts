import { Injectable } from '@nestjs/common';
import { enumData } from 'src/constants/enum-data';
import { ColumnEntity, UserEntity } from 'src/entities';
import { TeamEntity } from 'src/entities/team.entity';
import { UserRepository } from 'src/repositories';
import { TeamRepository } from 'src/repositories/team.repository';
import { In, Like } from 'typeorm';
import { ColumnService } from '../columns/column.service';
import { ColumnDTO } from '../columns/dto';
import { PaginationDTO } from './../dto/index';
import { InviteLstMemberDTO, RemoveUserTeamDTO, TeamDTO } from './dto';

@Injectable()
export class TeamsService {
  constructor(
    private repo: TeamRepository,
    private userRepo: UserRepository,
    private columnService: ColumnService,
  ) {}

  async getYourWorkPlace(user: UserEntity) {
    return await this.repo.findOne({
      where: { id: user.id, isWorkPlace: true },
    });
  }

  async pagination(paginationDTO: PaginationDTO, user: UserEntity) {
    const where: any = {};
    if (paginationDTO.where?.name) {
      where.name = Like(`%${paginationDTO.where.name}%`);
    }
    const data: [any[], number] = await this.repo.findAndCount({
      where: {
        ...where,
        isDeleted: false,
        isWorkPlace: false,
        members: {
          id: In([user.id, ...(paginationDTO.where?.members || [])]),
        },
      },
      relations: { members: true },
      order: { createdAt: 'DESC' },
      skip: paginationDTO.skip,
      take: paginationDTO?.take || 10,
    });
    const lstTeamId = data[0].map((item) => item.id);
    const lstTeams: any = await this.repo.find({
      where: { id: In(lstTeamId) },
      relations: { members: true },
    });
    const res = lstTeams.map((item: any) => {
      const { __members__, ...team } = item;
      delete item.__members__;
      const tags = team.tags.split(',').map((tag: string) => {
        const tagData =
          enumData.BOARD_TAG[tag.trim() as keyof typeof enumData.BOARD_TAG];

        return tagData;
      });
      return { ...team, members: __members__, tags };
    });

    return [res, data[1]];
  }
  async create(data: TeamDTO, user: UserEntity) {
    return this.repo.manager.transaction(async (transaction) => {
      const columRepo = transaction.getRepository(ColumnEntity);
      const teamRepo = transaction.getRepository(TeamEntity);
      const userRepo = transaction.getRepository(UserEntity);
      const team = await teamRepo.findOne({
        where: { name: data.name },
      });
      if (team) {
        throw new Error('Team already exists!');
      }

      const users: UserEntity[] = await userRepo.find({
        where: { id: In(data.members) },
      });
      const lstMember = [user, ...users];

      const teamEntity = new TeamEntity();
      teamEntity.name = data.name;
      teamEntity.thumbnails = data.thumbnails;
      teamEntity.description = data.description;
      teamEntity.tags = data.tags;
      teamEntity.createdAt = new Date();
      teamEntity.createdBy = user.id;
      teamEntity.createdByName = user.username;
      teamEntity.isWorkPlace = data.isWorkPlace || false;
      teamEntity.members = Promise.resolve(lstMember);

      const res: any = await this.repo.save(teamEntity);
      const members = res.__members__;
      delete res.__members__;

      const tags = res.tags
        .split(',')
        .map(
          (tag: string) =>
            enumData.BOARD_TAG[tag.trim() as keyof typeof enumData.BOARD_TAG],
        );

      const columns = Object.keys(enumData.taskStatus).map(
        (key) => enumData.taskStatus[key as keyof typeof enumData.taskStatus],
      );

      await Promise.all(
        columns.map(async (column, index) => {
          const columnDto = new ColumnDTO();
          columnDto.name = column.name;
          columnDto.teamId = res.id;
          columnDto.statusCode = column.code;
          columnDto.index = +index + 1;
          await this.columnService.create(columnDto, user, columRepo);
        }),
      );

      return {
        message: 'Team created successfully',
        data: { ...res, members, tags },
      };
    });
  }

  async addUserToTeam(id: string, userId: string) {
    const team = await this.repo.findOneBy({ id });
    if (!team) {
      throw new Error('Team not found!');
    }
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found!');
    }
    (await team.members).push(user);
    await this.repo.save(team);
    return { message: 'User added to team successfully', data: team };
  }
  async addUsersToTeam(id: string, data: InviteLstMemberDTO) {
    const team = await this.repo.findOneBy({ id });
    if (!team) {
      throw new Error('Team not found!');
    }
    const users: UserEntity[] = await this.userRepo.find({
      where: { id: In(data.lstMembers) },
    });
    if (users.length === 0) {
      throw new Error('User not found!');
    }
    (await team.members).push(...users);
    await this.repo.save(team);
    return { message: 'Users added to team successfully', data: team };
  }

  async removeUserFromTeam(removeUserTeamDTO: RemoveUserTeamDTO) {
    const team = await this.repo.findOneBy({ id: removeUserTeamDTO.id });
    if (!team) {
      throw new Error('Team not found!');
    }
    const user = await this.userRepo.findOneBy({
      id: removeUserTeamDTO.userId,
    });
    if (!user) {
      throw new Error('User not found!');
    }
    team.members = Promise.resolve(
      (await team.members).filter((u) => u.id !== removeUserTeamDTO.userId),
    );
    await this.repo.save(team);
    return { message: 'User removed from team successfully', data: team };
  }

  async deleteTeam(id: string) {
    const team = await this.repo.findOneBy({ id });
    if (!team) {
      throw new Error('Team not found!');
    }
    await this.repo.save({ ...team, isDeleted: true });
    return { message: 'Team deleted successfully' };
  }

  async forceDeleteTeam(id: string) {
    const team = await this.repo.findOneBy({ id });
    if (!team) {
      throw new Error('Team not found!');
    }
    await this.repo.remove(team);
    return { message: 'Team deleted successfully' };
  }

  async detail(id: string, user: UserEntity) {
    const team: any = await this.repo
      .createQueryBuilder()
      .select('team')
      .from(TeamEntity, 'team')
      .leftJoinAndSelect('team.members', 'user')
      .where('team.id = :id', { id: id })
      .andWhere('user.id = :userId', { userId: user.id })
      .getOne();

    if (!team) {
      throw new Error('Team not found!');
    }

    const users = team.__users__;
    delete team.__users__;
    delete team.__has_users__;

    const tags = team.tags.split(',').map((tag: string) => {
      const tagData =
        enumData.BOARD_TAG[tag.trim() as keyof typeof enumData.BOARD_TAG];

      return tagData;
    });

    return { message: 'Team detail', data: { ...team, users, tags } };
  }
}
