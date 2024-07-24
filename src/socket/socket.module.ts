import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/repositories';
import { TypeOrmExModule } from 'src/typeorm';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserRepository])],
  providers: [SocketService, JwtService, SocketGateway],
  exports: [SocketService],
})
export class SocketModule {}
