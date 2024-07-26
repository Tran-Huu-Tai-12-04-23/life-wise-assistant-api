import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/entities';
import { HistoryEntity } from 'src/entities/history.entity';
import {
  HistoryRepository,
  NotificationRepository,
  UserRepository,
} from 'src/repositories';
import { GroupChatRepository } from 'src/repositories/groupchat.repository';
import { MessageRepository } from 'src/repositories/message.repository';
import { CreateHistoryDTO } from './dto';

@Injectable()
export class CommonService {
  constructor(
    private notificationRepo: NotificationRepository,
    private groupChatRepo: GroupChatRepository,
    private messageRepo: MessageRepository,
    private userRepo: UserRepository,
    private historyRepo: HistoryRepository,
  ) {}

  async createHistory(user: UserEntity, createHisDTO: CreateHistoryDTO) {
    const history = new HistoryEntity();

    history.content = createHisDTO.content;
    history.type = createHisDTO.type;
    history.createdBy = user.id;
    history.createdAt = new Date();
    history.createdByName = user.username;
    history.targetActionId = createHisDTO.targetActionId;

    await this.historyRepo.save(history);
  }
}
