import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ColumnModule } from './modules/columns/column.module';
import { TaskModule } from './modules/tasks/task.module';
import { TeamModule } from './modules/teams/team.module';
import { WebHookModule } from './modules/webhook/webhook.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    TeamModule,
    ColumnModule,
    TaskModule,
    SocketModule,
    WebHookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
