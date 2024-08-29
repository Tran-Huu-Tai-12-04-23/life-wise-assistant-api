import { Module } from '@nestjs/common';
import {
  ColumnRepository,
  TaskCommentRepository,
  TaskHistoryRepository,
  TaskRepository,
  UserRepository,
} from 'src/repositories';
import { SubTaskRepository } from 'src/repositories/subTask.repository';
import { TaskFileRepository } from 'src/repositories/taskFile.repository';
import { TeamRepository } from 'src/repositories/team.repository';
import { TeamPermissionRepository } from 'src/repositories/teamPermission.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { DiscordService } from '../discord/discord.service';
import { TaskService } from '../tasks/task.service';
import { MobileController } from './mobile.controller';
import { MobileService } from './module.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      TaskRepository,
      ColumnRepository,
      UserRepository,
      TaskCommentRepository,
      SubTaskRepository,
      TaskFileRepository,
      TaskHistoryRepository,
      TeamPermissionRepository,
      TeamRepository,
    ]),
  ],
  providers: [TaskService, MobileService, DiscordService],
  controllers: [MobileController],
  exports: [MobileService],
})
export class MobileModule {}
