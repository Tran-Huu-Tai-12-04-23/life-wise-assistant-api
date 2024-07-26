import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NotificationRepository, UserRepository } from 'src/repositories';
import { GroupChatRepository } from 'src/repositories/groupchat.repository';
import { MessageRepository } from 'src/repositories/message.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      NotificationRepository,
      MessageRepository,
      GroupChatRepository,
    ]),
  ],
  providers: [SocketService, JwtService, SocketGateway],
  exports: [SocketService],
})
export class SocketModule {}
