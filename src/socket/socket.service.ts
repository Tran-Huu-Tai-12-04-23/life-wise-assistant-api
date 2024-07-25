import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { DeviceEntity } from 'src/entities/device.entity';
import { DeviceRepository, UserRepository } from 'src/repositories';

@Injectable()
export class SocketService {
  private server: Server;
  private connectedClients = new Array<DeviceEntity>();
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userRepo: UserRepository,
    private deviceRepo: DeviceRepository,
  ) {}

  JWT_SECRET = this.configService.get<string>('JWT_SECRET');

  public init(server: Server) {
    this.server = server;
    this.server.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);
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

      const deviceClient = new DeviceEntity();
      deviceClient.socketId = client.id;
      deviceClient.status = false;
      deviceClient.user = Promise.resolve(user);
      deviceClient.type = 'CHAT';
      this.connectedClients.push(deviceClient);
    } catch (error) {
      console.log(error);
    }
  }

  async disconnect(client: Socket) {
    const deviceClient = await this.deviceRepo.findOneBy({
      socketId: client.id,
    });
    if (deviceClient) {
      this.connectedClients.filter((item) => item.socketId !== client.id);
    }
  }

  async getUserById(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
