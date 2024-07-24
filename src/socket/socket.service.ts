import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { DeviceEntity } from 'src/entities/device';
import { UserRepository } from 'src/repositories';

@Injectable()
export class SocketService {
  private server: Server;
  private connectedClients = new Map<string, DeviceEntity>();
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userRepo: UserRepository,
  ) {}

  JWT_SECRET = this.configService.get<string>('JWT_SECRET');

  public init(server: Server) {
    this.server = server;
    this.server.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);
      // Handle incoming events
      socket.on('chat message', (message: string) => {
        console.log(`Message from ${socket.id}: ${message}`);
        this.server.emit('chat message', message); // Broadcast message to all clients
      });

      // Handle disconnection
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
      console.log(user);

      console.log(`Client connected: ${client.id}`);
    } catch (error) {
      console.log(error);
    }
  }

  disconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  async getUserById(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
