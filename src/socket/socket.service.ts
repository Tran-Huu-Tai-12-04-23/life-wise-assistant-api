import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { UserRepository } from 'src/repositories';
import { Device } from './device';

@Injectable()
export class SocketService {
  private server: Server;
  private connectedClients = new Array<any>();
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userRepo: UserRepository,
  ) {}

  JWT_SECRET = this.configService.get<string>('JWT_SECRET');

  public init(server: Server) {
    this.server = server;
    this.server.on('connection', (socket: Socket) => {
      // console.log(`Client connected: ${socket.id}`);
      // Handle incoming events
      socket.on('chat message', (message: string) => {
        console.log(`Message from ${socket.id}: ${message}`);
        this.connectedClients.forEach((item) => {
          if (item.socketId !== socket.id) {
            this.server.to(item.socketId).emit('chat message', message);
          }
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
