import { Module } from '@nestjs/common';
import {
  ColumnRepository,
  HistoryRepository,
  TaskCommentRepository,
  TaskHistoryRepository,
  TaskRepository,
} from 'src/repositories';
import { SubTaskRepository } from 'src/repositories/subTask.repository';
import { TaskFileRepository } from 'src/repositories/taskFile.repository';
import { TeamRepository } from 'src/repositories/team.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { TypeOrmExModule } from 'src/typeorm/typeorm-ex.module';
import { TaskModule } from '../tasks/task.module';
import { ColumnController } from './column.controller';
import { ColumnService } from './column.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      ColumnRepository,
      UserRepository,
      TeamRepository,
      TaskCommentRepository,
      TaskRepository,
      SubTaskRepository,
      TaskHistoryRepository,
      TaskFileRepository,
      HistoryRepository,
    ]),
    TaskModule,
  ],
  providers: [ColumnService],
  controllers: [ColumnController],
  exports: [ColumnService],
})
export class ColumnModule {}
