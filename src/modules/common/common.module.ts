import { Module } from '@nestjs/common';
import {
  HistoryRepository,
  NotificationRepository,
  UserRepository,
} from 'src/repositories';
import { GroupChatRepository } from 'src/repositories/groupchat.repository';
import { MessageRepository } from 'src/repositories/message.repository';
import { TypeOrmExModule } from 'src/typeorm/typeorm-ex.module';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';

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
  providers: [CommonService],
  controllers: [CommonController],
  exports: [CommonService],
})
export class CommonModule {}
