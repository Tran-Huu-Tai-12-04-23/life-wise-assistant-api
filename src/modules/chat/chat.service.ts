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
import { CreateChatDTO, CreateGroupChatDTO } from './dto';

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
          id: In([userTargetId]),
        },
      },
      // relations: {
      //   lstMember: true,
      // },
    });

    console.log(groupChatExist);

    // if (groupChatExist) {
    //   const isExist = groupChatExist.__lstMember__.find(
    //     (us: { id: string }) => us.id === user.id,
    //   );

    //   if (isExist) {
    //     throw new Error('User already in group chat');
    //   }
    // }

    // const groupChatEntity = new GroupChatEntity();
    // groupChatEntity.name = userTargetId;
    // groupChatEntity.type = EChatType.SINGLE;
    // groupChatEntity.owner = Promise.resolve(user);

    // const lstUser = await this.userRepo.find({
    //   where: {
    //     id: In([userTargetId, user.id]),
    //     isDeleted: false,
    //   },
    // });
    // groupChatEntity.lstMember = Promise.resolve(lstUser);
    // groupChatEntity.createdBy = user.id;
    // groupChatEntity.createdByName = user.username;
    // groupChatEntity.createdAt = new Date();

    // await this.groupChatRepo.save(groupChatEntity);

    // const history = new CreateHistoryDTO();
    // history.content = `${user.username} created chat with ${userTargetId}`;
    // history.type = EHistoryType.CREATE_CHAT;
    // history.targetActionId = groupChatEntity.id;
    // await this.commonService.createHistory(user, history);

    return {
      message: 'Create chat successfully!',
      // data: groupChatEntity,
    };
  }
}
