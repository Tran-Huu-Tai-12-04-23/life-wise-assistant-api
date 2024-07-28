import { Injectable, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { SocketService } from './socket.service';

@WebSocketGateway(3300, { cors: true })
@Injectable()
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private socketService: SocketService) {}

  @UseGuards(JwtAuthGuard)
  afterInit(server: Server) {
    this.socketService.init(server);
  }

  handleConnection(client: Socket) {
    this.socketService.connection(client);
  }

  handleDisconnect(client: Socket) {
    this.socketService.disconnect(client);
  }

  sendNotification(message: string) {
    this.socketService.sendNotification(message);
  }
}
