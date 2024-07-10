import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@Injectable()
export class SocketService {
  private server: Server;

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
    this.server.emit('notification', message); // Send notification to all clients
  }
}
