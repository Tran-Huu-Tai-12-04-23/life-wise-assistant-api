import { Module } from '@nestjs/common';
import {
  HistoryRepository,
  NotificationRepository,
  UserRepository,
} from 'src/repositories';
import { GroupChatRepository } from 'src/repositories/groupchat.repository';
import { MessageRepository } from 'src/repositories/message.repository';
import { TypeOrmExModule } from 'src/typeorm/typeorm-ex.module';
import { CommonService } from '../common/common.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      NotificationRepository,
      GroupChatRepository,
      MessageRepository,
      UserRepository,
      HistoryRepository,
    ]),
  ],
  providers: [ChatService, CommonService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
