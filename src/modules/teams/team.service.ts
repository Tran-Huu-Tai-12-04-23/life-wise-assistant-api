import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';
import { NOTIFICATION_TYPE, enumData } from 'src/constants/enum-data';
import { ColumnEntity, NotificationEntity, UserEntity } from 'src/entities';
import { TeamEntity } from 'src/entities/team.entity';
import { TeamHistoryEntity } from 'src/entities/teamHistory.entity';
import { TeamInviteEntity } from 'src/entities/teamInvited.entity';
import { TeamPermissionEntity } from 'src/entities/teamPermission.entity';
import { UserRepository } from 'src/repositories';
import { TeamRepository } from 'src/repositories/team.repository';
import { TeamPermissionRepository } from 'src/repositories/teamPermission.repository';
import { In, Like } from 'typeorm';
import { ColumnService } from '../columns/column.service';
import { ColumnDTO } from '../columns/dto';
import {
  NotificationTeamInviteToCreateDTO,
  NotificationToCreateDTO,
} from '../notification/dto';
import { NotificationService } from '../notification/notification.service';
import { PaginationDTO } from './../dto/index';
import {
  InviteLstMemberDTO,
  RemoveUserTeamDTO,
  TeamDTO,
  TeamInviteDTO,
  TeamPermissionUpdateDTO,
} from './dto';

@Injectable()
export class TeamsService {
  inviteLink = '';
  JWT_SECRET = '';
  constructor(
    private repo: TeamRepository,
    private userRepo: UserRepository,
    private columnService: ColumnService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
    private teamPermissionRepo: TeamPermissionRepository,
  ) {
    this.inviteLink = this.configService.get('INVITE_LINK') || '';
    this.JWT_SECRET = this.configService.get<string>('JWT_SECRET') || '';
  }

  async updateTeamPermission(data: TeamPermissionUpdateDTO, user: UserEntity) {
    return await this.repo.manager.transaction(async (transaction) => {
      const teamPermissionRepo =
        transaction.getRepository(TeamPermissionEntity);
      const teamHistoryRepo = transaction.getRepository(TeamHistoryEntity);

      const historyString = [];
      const teamPermission: any = await teamPermissionRepo.findOne({
        where: {
          id: data.id,
        },
        relations: {
          user: true,
        },
      });

      if (!teamPermission) {
        throw new NotFoundException('Team permission not found!');
      }

      const updateData: any = {};
      if (data.isCreate) {
        updateData.isCreate = data.isCreate;
        if (teamPermission.isCreate !== data.isCreate) {
          historyString.push(
            `create: from ${teamPermission.isCreate ? 'allow' : 'not allow'} =>  ${data.isCreate ? 'allow' : 'not allow'}`,
          );
        }
      }
      if (data.isEdit) {
        updateData.isEdit = data.isEdit;
        if (teamPermission.isEdit !== data.isEdit) {
          historyString.push(
            `edit: from ${teamPermission.isEdit ? 'allow' : 'not allow'} =>  ${data.isEdit ? 'allow' : 'not allow'}`,
          );
        }
      }
      if (data.isDelete) {
        updateData.isDelete = data.isDelete;
        if (teamPermission.isDelete !== data.isDelete) {
          historyString.push(
            `delete: from ${teamPermission.isDelete ? 'allow' : 'not allow'} =>  ${data.isDelete ? 'allow' : 'not allow'}`,
          );
        }
      }
      if (data.isAssign) {
        updateData.isAssign = data.isAssign;
        if (teamPermission.isAssign !== data.isAssign) {
          historyString.push(
            `assign: from ${teamPermission.isAssign ? 'allow' : 'not allow'} =>  ${data.isAssign ? 'allow' : 'not allow'}`,
          );
        }
      }
      if (data.isAdmin) {
        updateData.isAdmin = data.isAdmin;
        if (teamPermission.isAdmin !== data.isAdmin) {
          historyString.push(
            `role: from ${teamPermission.isAdmin ? 'admin' : 'member'} =>  ${data.isAdmin ? 'admin' : 'member'}`,
          );
        }
      }
      if (data.isInvite) {
        updateData.isInvite = data.isInvite;
        if (teamPermission.isInvite !== data.isInvite) {
          historyString.push(
            `invite: from ${teamPermission.isInvite ? 'allow' : 'not allow'} =>  ${data.isInvite ? 'allow' : 'not allow'}`,
          );
        }
      }
      updateData.updatedAt = new Date();
      updateData.updatedBy = user.id;

      const userOfPermission = teamPermission.__user__;
      delete teamPermission.__user__;

      await teamPermissionRepo.update(teamPermission.id, updateData);

      // create history

      const history = new TeamHistoryEntity();
      history.title = 'Update team permission';
      history.description = `Update team permission of user [${userOfPermission.username}] with ${historyString.join(', ')}`;
      history.teamId = teamPermission.teamId;
      history.ownerId = user.id;
      history.createdAt = new Date();
      history.createdBy = user.id;
      history.createdByName = user.username;
      await teamHistoryRepo.save(history);

      return {
        message: 'Update team permission successfully!',
      };
    });
  }

  async loadUserTeamPermission(
    teamId: string,
    userId: string,
    user: UserEntity,
  ) {
    const teamPermission = await this.teamPermissionRepo.findOne({
      where: { userId: userId, teamId: teamId, isDelete: false },
    });
    if (!teamPermission) {
      const teamPermissionEntity = new TeamPermissionEntity();
      teamPermissionEntity.isAdmin = false;
      teamPermissionEntity.isEdit = false;
      teamPermissionEntity.isDelete = false;
      teamPermissionEntity.isCreate = false;
      teamPermissionEntity.isAssign = false;
      teamPermissionEntity.isInvite = false;
      teamPermissionEntity.userId = userId;
      teamPermissionEntity.teamId = teamId;
      teamPermissionEntity.createdAt = new Date();
      teamPermissionEntity.createdBy = user.id;
      teamPermissionEntity.createdByName = user.username;
      await this.teamPermissionRepo.save(teamPermissionEntity);

      return teamPermissionEntity;
    }

    return teamPermission;
  }

  async paginationForTeamHistory(
    data: PaginationDTO,
    teamId: string,
    user: UserEntity,
  ) {
    return await this.repo.manager.transaction(async (transaction) => {
      const historyRepo = transaction.getRepository(TeamHistoryEntity);
      const teamPermissionRepo =
        transaction.getRepository(TeamPermissionEntity);

      const teamPermission = await teamPermissionRepo.findOneBy({
        userId: user.id,
        teamId: teamId,
      });

      if (!teamPermission) {
        throw new Error(
          'You do not have permission to view this team history!',
        );
      }

      const result = await historyRepo.findAndCount({
        where: {
          teamId: teamId,
        },
        order: { createdAt: 'DESC' },
        skip: data.skip,
        take: data.take || 10,
        relations: {
          owner: true,
        },
      });

      const isHasNextPage = data.skip + data.take < result[1];

      return [result[0], result[1], isHasNextPage];
    });
  }
  async inviteMemberToTeam(data: TeamInviteDTO, user: UserEntity) {
    return await this.repo.manager.transaction(async (transaction) => {
      const teamRepo = transaction.getRepository(TeamEntity);
      const teamPermissionRepo =
        transaction.getRepository(TeamPermissionEntity);
      const teamInviteRepo = transaction.getRepository(TeamInviteEntity);
      const historyRepo = transaction.getRepository(TeamHistoryEntity);
      const userRepo = transaction.getRepository(UserEntity);
      const notificationRepo = transaction.getRepository(NotificationEntity);

      const team = await teamRepo.findOneBy({ id: data.teamId });

      if (!team) {
        throw new Error('Team not found!');
      }

      const teamPermission = await teamPermissionRepo.findOneBy({
        userId: user.id,
        teamId: data.teamId,
      });

      if (
        teamPermission?.isAdmin === false &&
        teamPermission.isInvite === false
      ) {
        throw new Error(
          'You do not have permission to invite user to this team!',
        );
      }

      const users: UserEntity[] = await userRepo.find({
        where: { id: In(data.lstUserId) },
      });

      for (const userData of users) {
        const teamInviteExist = await teamInviteRepo.findOneBy({
          teamId: data.teamId,
          userId: userData.id,
        });

        if (teamInviteExist) {
          throw new Error('User already invited to this team!');
        }
        const isExist = await teamPermissionRepo.findOneBy({
          userId: userData.id,
          teamId: data.teamId,
        });

        if (isExist) {
          throw new Error('User already in this team!');
        }
        const teamInvited = new TeamInviteEntity();
        teamInvited.teamId = data.teamId;
        teamInvited.userId = userData.id;
        teamInvited.createdBy = user.id;
        teamInvited.createdAt = new Date();
        teamInvited.createdByName = user.username;

        await teamInviteRepo.save(teamInvited);

        // send notification
        const bodyToCreateInviteTeamNotification: NotificationTeamInviteToCreateDTO =
          {
            title: user.username + ' Invited you to their team!',
            subTitle: '',
            description: `Invite to team [${team.name}]`,
            type: NOTIFICATION_TYPE.INVITE_TEAM.code,
            linkTarget: `team/${team.id}`,
            userId: userData.id,
            createdByName: user.username,
            teamInviteId: teamInvited.id,
            createdBy: user.id,
          };

        await this.notificationService.createTeamInvite(
          bodyToCreateInviteTeamNotification,
          notificationRepo,
        );
      }

      const lstUserNameString = users.map((u) => u.username).join(', ');

      /// create history
      const history = new TeamHistoryEntity();
      history.title = 'Accepted invite to team';
      history.description = `Invite user [${lstUserNameString}] to [${team.name}]`;
      history.teamId = data.teamId;
      history.ownerId = user.id;
      history.createdAt = new Date();
      history.createdBy = user.id;
      history.createdByName = user.username;
      history.createdBy = user.id;
      history.createdByName = user.username;
      await historyRepo.save(history);

      return { message: 'Invite user to team successfully!' };
    });
  }

  async acceptInviteTeam(teamInviteId: string, user: UserEntity) {
    return await this.repo.manager.transaction(async (transaction) => {
      const teamInvited = transaction.getRepository(TeamInviteEntity);
      const teamRepo = transaction.getRepository(TeamEntity);
      const historyRepo = transaction.getRepository(TeamHistoryEntity);
      const notificationRepo = transaction.getRepository(NotificationEntity);
      const teamPermissionRepo =
        transaction.getRepository(TeamPermissionEntity);

      const teamInvite: any = await teamInvited.findOne({
        where: { id: teamInviteId, isDeleted: false },
        relations: {
          user: true,
          team: true,
        },
      });

      if (!teamInvite) {
        throw new Error(
          'You don`t have invite from ' + user.username + ' to join team!',
        );
      }

      const notificationOfTeamInvite = await notificationRepo.find({
        where: {
          teamInviteId: teamInviteId,
          isDeleted: false,
          isRead: false,
        },
      });

      for (const notification of notificationOfTeamInvite) {
        await notificationRepo.save({ ...notification, isRead: true });
      }
      const team = await this.repo.findOneBy({
        id: teamInvite.teamId,
        isDeleted: false,
      });

      if (!team) {
        throw new Error('Team not found!');
      }

      const isExistTeam = (await team.members).find((u) => u.id === user.id);

      if (isExistTeam) {
        throw new Error('You already in this team!');
      }

      team.members = Promise.resolve([...(await team.members), user]);

      await teamRepo.save(team);

      // create team permission for user
      const teamPermission = new TeamPermissionEntity();
      teamPermission.userId = user.id;
      teamPermission.createdBy = teamInvite.__user__.id;
      teamPermission.createdByName = teamInvite.__user__.username;
      teamPermission.createdAt = new Date();
      teamPermission.teamId = team.id;

      await teamPermissionRepo.save(teamPermission);

      /// create history
      const history = new TeamHistoryEntity();
      history.title = 'Accepted invite to team';
      history.description = `[${user.username}] accepted invite to team [${team.name}]`;
      history.teamId = teamInvite.teamId;
      history.ownerId = user.id;
      history.createdAt = new Date();
      history.createdBy = user.id;
      history.createdByName = user.username;
      history.createdBy = user.id;
      history.createdByName = user.username;
      await historyRepo.save(history);

      // create notification for user who invited
      const notificationDTO: NotificationToCreateDTO = {
        title: user.username + ' accepted your invite!',
        subTitle: '',
        description: `[${user.username}] Accepted invite to team [${team.name}] at ${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}`,

        type: NOTIFICATION_TYPE.ACCEPT_INVITE_TEAM.code,
        linkTarget: `team/${team.id}`,
        userId: teamInvite.createdBy || user.id,
        createdByName: user.username,
        createdBy: teamInvite.createdBy,
      };

      await this.notificationService.createData(
        notificationDTO,
        notificationRepo,
      );

      return {
        message: 'Accept invite successfully!',
        lstNotificationIdRead: notificationOfTeamInvite.map((item) => item.id),
      };
    });
  }

  async rejectInviteTeam(teamInviteId: string, user: UserEntity) {
    return await this.repo.manager.transaction(async (transaction) => {
      const teamInvited = transaction.getRepository(TeamInviteEntity);
      const historyRepo = transaction.getRepository(TeamHistoryEntity);
      const notificationRepo = transaction.getRepository(NotificationEntity);

      const teamInvite: any = await teamInvited.findOne({
        where: {
          id: teamInviteId,
          isDeleted: false,
        },
        relations: {
          team: true,
        },
      });

      if (!teamInvite) {
        throw new Error(
          'You don`t have invite from ' + user.username + ' to join team!',
        );
      }

      const notificationOfTeamInvite = await notificationRepo.find({
        where: {
          teamInviteId: teamInviteId,
          isDeleted: false,
          isRead: false,
        },
      });

      for (const notification of notificationOfTeamInvite) {
        await notificationRepo.save({ ...notification, isRead: true });
      }

      await teamInvited.save({ ...teamInvite, isDeleted: true });

      // create history
      const history = new TeamHistoryEntity();
      history.title = 'Reject invite to team';
      history.description = `[${user.username}] rejected invite to team [${teamInvite.__team__.name}]`;
      history.teamId = teamInvite.teamId;
      history.ownerId = user.id;
      history.createdAt = new Date();
      history.createdBy = user.id;
      history.createdByName = user.username;
      history.createdBy = user.id;
      history.createdByName = user.username;
      await historyRepo.save(history);

      // create notification for user who invited
      const notificationDTO: NotificationToCreateDTO = {
        title: user.username + ' rejected your invite!',
        subTitle: '',
        description: `[${user.username}] Rejected invite to team [${teamInvite.__team__.name}] at ${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}`,
        type: NOTIFICATION_TYPE.REJECT_INVITE_TEAM.code,
        linkTarget: `team/${teamInvite.teamId}`,
        userId: teamInvite.createdBy,
        createdByName: user.username,
        createdBy: teamInvite.createdBy,
      };

      await this.notificationService.createData(
        notificationDTO,
        notificationRepo,
      );

      return {
        message: 'Reject invite successfully!',
        lstNotificationIdRead: notificationOfTeamInvite.map((item) => item.id),
      };
    });
  }

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
      const isAllowInviteUser = team.createdBy === user.id;
      const inviteTokenExpire = new Date(team.inviteTokenExpiredDate);
      const now = new Date();

      if (inviteTokenExpire < now) {
        team.isExpiredInviteToken = false;
      } else {
        team.isExpiredInviteToken = true;
      }

      return {
        ...team,
        members: __members__,
        tags,
        isAllowInviteUser,
        isOwner: team.createdBy === user.id,
      };
    });

    return [res, data[1]];
  }
  async create(data: TeamDTO, user: UserEntity) {
    return this.repo.manager.transaction(async (transaction) => {
      const columRepo = transaction.getRepository(ColumnEntity);
      const teamRepo = transaction.getRepository(TeamEntity);
      const userRepo = transaction.getRepository(UserEntity);
      const teamHistoryRepo = transaction.getRepository(TeamHistoryEntity);
      const teamPermissionRepo =
        transaction.getRepository(TeamPermissionEntity);

      const team = await teamRepo.findOne({
        where: { name: data.name },
      });
      if (team) {
        throw new Error('Team already exists!');
      }

      const users: UserEntity[] = await userRepo.find({
        where: { id: In([...(data?.members || [])]) },
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

      // new history
      const history = new TeamHistoryEntity();
      history.title = 'Create new team';
      history.description = `Create new team [${res.name}]`;
      history.teamId = res.id;
      history.ownerId = user.id;
      history.createdAt = new Date();
      history.createdBy = user.id;
      history.createdByName = user.username;
      await teamHistoryRepo.save(history);
      // create team permission
      for (const member of lstMember) {
        const teamPermission = new TeamPermissionEntity();
        teamPermission.userId = member.id;
        teamPermission.createdBy = user.id;
        teamPermission.createdByName = user.username;
        teamPermission.teamId = res.id;
        teamPermission.isCreate = member.id === user.id;
        teamPermission.isDelete = member.id === user.id;
        teamPermission.isEdit = member.id === user.id;
        teamPermission.isAssign = member.id === user.id;
        teamPermission.isAdmin = member.id === user.id;
        teamPermission.isInvite = member.id === user.id;
        await teamPermissionRepo.save(teamPermission);
      }

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

  async generateInviteToken(teamId: string, user: UserEntity) {
    const currentTeam = await this.repo.findOneBy({
      id: teamId,
      isDeleted: false,
    });

    if (!currentTeam) {
      throw new Error('Team not found!');
    }

    if (currentTeam.createdBy !== user.id) {
      throw new Error(
        'You are not the owner of this team! Can not generate invite link!',
      );
    }

    const inviteToken = this.jwtService.sign(
      { teamId },
      { secret: this.JWT_SECRET },
    );

    return await this.repo.manager.transaction(async (transaction) => {
      const teamRepo = transaction.getRepository(TeamEntity);
      const inviteTokenExpiredDate = new Date(Date.now() + 1000 * 60 * 60 * 24);
      await teamRepo.update(teamId, {
        ...currentTeam,
        inviteToken,
        inviteTokenExpiredDate: inviteTokenExpiredDate,
      });

      return {
        inviteLink: `${this.inviteLink}${inviteToken}`,
        inviteTokenExpiredDate,
        message: 'Generate invite link successfully!',
      };
    });
  }

  async joinToTeamByLink(token: string, user: UserEntity) {
    const payload = this.jwtService.verify(token, {
      secret: this.JWT_SECRET,
    });
    if (!payload) {
      throw new Error('Invalid token');
    }
    const { teamId } = payload;
    const currentTeam: any = await this.repo.findOne({
      where: {
        id: teamId,
        isDeleted: false,
      },
      relations: {
        members: true,
      },
    });
    if (!currentTeam) {
      throw new Error('Team not found!');
    }

    const isExistTeam = currentTeam.__members__.find(
      (u: any) => u.id === user.id,
    );
    if (!isExistTeam) {
      await this.repo.update(teamId, {
        ...currentTeam,
        members: Promise.resolve([...(await currentTeam.members), user]),
      });
    }

    return { message: 'Join team successfully!' };
  }
}
