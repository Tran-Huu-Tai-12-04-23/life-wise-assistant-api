import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ColumnRepository,
  NotificationRepository,
  TaskCommentRepository,
  TaskRepository,
} from 'src/repositories';
import { SubTaskRepository } from 'src/repositories/subTask.repository';
import { TaskFileRepository } from 'src/repositories/taskFile.repository';
import { TeamRepository } from 'src/repositories/team.repository';
import { TeamPermissionRepository } from 'src/repositories/teamPermission.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { TypeOrmExModule } from 'src/typeorm/typeorm-ex.module';
import { ColumnService } from '../columns/column.service';
import { NotificationService } from '../notification/notification.service';
import { TeamController } from './team.controller';
import { TeamsService } from './team.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      TeamRepository,
      UserRepository,
      ColumnRepository,
      TaskRepository,
      TaskCommentRepository,
      SubTaskRepository,
      TaskFileRepository,
      NotificationRepository,
      TeamPermissionRepository,
    ]),
  ],
  providers: [
    TeamsService,
    ColumnService,
    JwtService,
    ConfigService,
    NotificationService,
  ],
  controllers: [TeamController],
  exports: [TeamsService],
})
export class TeamModule {}
