import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/modules/chat/chat.service';
import {
  GroupChatRepository,
  MessageRepository,
  UserRepository,
} from 'src/repositories';
import { Device } from './device';
import { MessageDTO } from './dto';

@Injectable()
export class SocketService {
  private server: Server;
  private connectedClients = new Array<Device>();
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userRepo: UserRepository,
    private groupChatRepo: GroupChatRepository,
    private messageRepo: MessageRepository,
    private chatService: ChatService,
  ) {}

  JWT_SECRET = this.configService.get<string>('JWT_SECRET');

  public init(server: Server) {
    this.server = server;
    this.server.on('connection', (socket: Socket) => {
      // Handle incoming events

      socket.on('chat message', async (message: MessageDTO) => {
        const groupChat: any = await this.groupChatRepo.findOne({
          where: {
            id: message.groupId,
            isDeleted: false,
          },
          relations: {
            lstMember: true,
          },
        });
        if (!groupChat) {
          console.log('Khong tim thay group chat');
          return;
        }

        const lstMemberId = groupChat.__lstMember__?.map(
          (item: any) => item.id,
        );
        console.log(groupChat.__lstMember__?.map((item: any) => item.username));
        const lstClient: Device[] = this.connectedClients.filter((item) =>
          lstMemberId.includes(item.user.id),
        );

        const res: any = await this.chatService.createMessage(
          groupChat,
          message.senderId,
          message.message,
        );

        const owner = res.__owner__;
        delete res.__owner__;
        delete res.__groupChat__;
        console.log(lstClient.length);
        // save message
        lstClient.forEach((item) => {
          console.log(item.socketId);
          this.server.to(item.socketId).emit('chat message', {
            ...res,
            isSender: item.user.id === message.senderId,
            owner,
            groupChat,
          });
        });
      });
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  public sendNotification(message: string) {
    this.server.emit('notification', message);
  }

  async connection(client: Socket) {
    const token: any = client.handshake?.query?.token;
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.JWT_SECRET,
      });

      if (!payload) {
        client.disconnect();
        throw new Error('Invalid token');
      }
      const user = await this.getUserById(payload.uid);

      if (!user) throw new NotFoundException('User not found');

      const deviceClient = new Device();
      deviceClient.socketId = client.id;
      deviceClient.status = false;
      deviceClient.user = user;
      deviceClient.type = 'CHAT';

      this.connectedClients.push(deviceClient);
    } catch (error) {
      console.log(error);
    }
  }

  async disconnect(client: Socket) {
    this.connectedClients = this.connectedClients.filter(
      (item) => item.socketId !== client.id,
    );
  }

  async getUserById(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
