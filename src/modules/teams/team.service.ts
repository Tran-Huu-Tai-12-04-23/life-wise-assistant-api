import { PaginationDTO } from './../dto/index';
import { Injectable } from '@nestjs/common';
import { TeamRepository } from 'src/repositories/team.repository';
import { InviteLstMemberDTO, RemoveUserTeamDTO, TeamDTO } from './dto';
import { TeamEntity } from 'src/entities/team.entity';
import { UserRepository } from 'src/repositories';
import { In } from 'typeorm';
import { UserEntity } from 'src/entities';

@Injectable()
export class TeamsService {
  constructor(
    private repo: TeamRepository,
    private userRepo: UserRepository,
  ) {}

  async pagination(paginationDTO: PaginationDTO) {
    const data: [any[], number] = await this.repo.findAndCount({
      where: { ...paginationDTO.where, isDeleted: false },
      relations: { members: true },
      order: { ...paginationDTO.order },
      skip: paginationDTO.skip,
      take: paginationDTO.take,
    });
    const res = data[0].map((item) => {
      const { __users__, ...team } = item;
      return { ...team, users: __users__ };
    });

    return [res, data[1]];
  }
  async create(data: TeamDTO, user: UserEntity) {
    const team = await this.repo.findOneBy({ name: data.name });
    if (team) {
      throw new Error('Team already exists!');
    }
    let lstMember = [user];
    const users: UserEntity[] = await this.userRepo.find({
      where: { id: In(data.users) },
    });
    lstMember = [...lstMember, ...(users || [])];
    const teamEntity = new TeamEntity();
    teamEntity.name = data.name;
    teamEntity.thumbnails = data.thumbnails;
    teamEntity.description = data.description;
    teamEntity.tags = data.tags;
    teamEntity.members = Promise.resolve(lstMember);
    console.log(teamEntity);
    const res = await this.repo.save(teamEntity);

    return { message: 'Team created successfully', data: res };
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
    return { message: 'Team detail', data: { ...team, users } };
  }
}
