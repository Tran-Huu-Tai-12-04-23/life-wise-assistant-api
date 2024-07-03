import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/typeorm/typeorm-ex.module';
import {
  ColumnRepository,
  TaskRepository,
  UserRepository,
} from 'src/repositories';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      TaskRepository,
      ColumnRepository,
      UserRepository,
    ]),
  ],
  providers: [TaskService],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}
