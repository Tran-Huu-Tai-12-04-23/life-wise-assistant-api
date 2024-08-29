import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ColumnRepository,
  HistoryRepository,
  TaskCommentRepository,
  TaskHistoryRepository,
  TaskRepository,
  UserRepository,
} from 'src/repositories';
import { SubTaskRepository } from 'src/repositories/subTask.repository';
import { TaskFileRepository } from 'src/repositories/taskFile.repository';
import { TeamRepository } from 'src/repositories/team.repository';
import { TeamPermissionRepository } from 'src/repositories/teamPermission.repository';
import { TypeOrmExModule } from 'src/typeorm/typeorm-ex.module';
import { DiscordService } from '../discord/discord.service';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      TaskRepository,
      ColumnRepository,
      UserRepository,
      SubTaskRepository,
      TaskHistoryRepository,
      TaskCommentRepository,
      TaskFileRepository,
      HistoryRepository,
      TeamPermissionRepository,
      TeamRepository,
    ]),
  ],
  providers: [TaskService, ConfigService, DiscordService],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}
