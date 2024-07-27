import { Injectable } from '@nestjs/common';
import { EChatType, EHistoryType } from 'src/constants/enum-data';
import { UserEntity } from 'src/entities';
import { GroupChatEntity } from 'src/entities/groupChat.entity';
import { NotificationRepository, UserRepository } from 'src/repositories';
import { GroupChatRepository } from 'src/repositories/groupchat.repository';
import { MessageRepository } from 'src/repositories/message.repository';
import { In } from 'typeorm';
import { CommonService } from '../common/common.service';
import { CreateHistoryDTO } from '../common/dto';
import { PaginationDTO } from '../dto';
import { CreateChatDTO, CreateGroupChatDTO, FilterGroupData } from './dto';

@Injectable()
export class ChatService {
  constructor(
    private notificationRepo: NotificationRepository,
    private groupChatRepo: GroupChatRepository,
    private messageRepo: MessageRepository,
    private userRepo: UserRepository,
    private commonService: CommonService,
  ) {}

  async createNewGroupChatMultiMember(
    user: UserEntity,
    createGroupChatDTO: CreateGroupChatDTO,
  ) {
    const { name, members } = createGroupChatDTO;

    await this.groupChatRepo.manager.transaction(async (transaction) => {
      const groupChatEntity = new GroupChatEntity();
      groupChatEntity.name = name;
      groupChatEntity.type = EChatType.GROUP;
      groupChatEntity.owner = Promise.resolve(user);

      const lstUser = await this.userRepo.find({
        where: {
          id: In(members),
          isDeleted: false,
        },
      });
      groupChatEntity.lstMember = Promise.resolve(lstUser);
      groupChatEntity.createdBy = user.id;
      groupChatEntity.createdByName = user.username;
      groupChatEntity.createdAt = new Date();

      await transaction.save(groupChatEntity);

      const history = new CreateHistoryDTO();
      history.content = `${user.username} created group chat ${name}`;
      history.type = EHistoryType.CREATE_GROUP_CHAT;
      history.targetActionId = groupChatEntity.id;
      await this.commonService.createHistory(user, history);

      return {
        message: 'Create group chat successfully!',
      };
    });
  }

  async createNewChat(user: UserEntity, createChatDTO: CreateChatDTO) {
    const { userTargetId } = createChatDTO;

    const groupChatExist: any = await this.groupChatRepo.findOne({
      where: {
        lstMember: {
          id: In([userTargetId, user.id]),
        },
        type: EChatType.SINGLE,
      },
      relations: {
        lstMember: true,
      },
    });
    if (groupChatExist) {
      const isExist = groupChatExist.__lstMember__.find(
        (us: { id: string }) => us.id === userTargetId,
      );

      if (isExist) {
        throw new Error('User already in group chat');
      }
    }

    const groupChatEntity = new GroupChatEntity();
    groupChatEntity.name = userTargetId;
    groupChatEntity.type = EChatType.SINGLE;
    groupChatEntity.owner = Promise.resolve(user);

    const lstUser = await this.userRepo.find({
      where: {
        id: In([userTargetId, user.id]),
        isDeleted: false,
      },
    });
    groupChatEntity.lstMember = Promise.resolve(lstUser);
    groupChatEntity.createdBy = user.id;
    groupChatEntity.createdByName = user.username;
    groupChatEntity.createdAt = new Date();

    await this.groupChatRepo.save(groupChatEntity);
    const receiver: any = await this.userRepo.findOne({
      where: { id: userTargetId },
      relations: {
        userDetail: true,
      },
    });

    const history = new CreateHistoryDTO();
    history.content = `${user.username} created chat with ${receiver.username}`;
    history.type = EHistoryType.CREATE_CHAT;
    history.targetActionId = groupChatEntity.id;
    await this.commonService.createHistory(user, history);

    const userDetail = receiver.__userDetail__;
    delete receiver.__userDetail__;
    return {
      message: 'Create chat successfully!',
      data: {
        ...groupChatEntity,
        receiver: {
          ...receiver,
          userDetail,
        },
        isSingleChat: true,
      },
    };
  }

  async groupChatPagination(
    user: UserEntity,
    body: PaginationDTO<FilterGroupData>,
  ) {
    const whereCon: any = {
      isDeleted: false,
    };
    if (body?.where?.name) {
      whereCon.name = body?.where?.name;
    }

    const groupChat: any = await this.groupChatRepo.findAndCount({
      where: whereCon,
      order: {
        updatedAt: 'DESC',
      },
      skip: body.skip,
      take: body.take,
      relations: {
        lstMember: true,
        owner: true,
      },
    });

    const res = groupChat[0].map((item: any) => {
      const lstMember = item.__lstMember__;
      const owner = item.__owner__;
      delete item.__owner__;
      delete item.__lstMember__;
      const isSingleChat = item.type === EChatType.SINGLE;
      const isGroupChat = item.type === EChatType.GROUP;

      const receiver = lstMember.filter(
        (us: { id: string }) => us.id !== user.id,
      );

      return {
        ...item,
        lstMember,
        receiver: receiver?.length > 0 ? receiver[0] : null,
        owner,
        isSingleChat,
        isGroupChat,
      };
    });

    return [res, groupChat[1]];
  }
}
