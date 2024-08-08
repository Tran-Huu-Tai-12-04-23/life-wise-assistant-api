import { Module } from '@nestjs/common';
import { ColumnRepository, TaskRepository } from 'src/repositories';
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
      TaskRepository,
    ]),
    TaskModule,
  ],
  providers: [ColumnService],
  controllers: [ColumnController],
  exports: [ColumnService],
})
export class ColumnModule {}
