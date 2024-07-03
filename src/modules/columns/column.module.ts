import { Module } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';
import { TypeOrmExModule } from 'src/typeorm/typeorm-ex.module';
import { ColumnRepository, TaskRepository } from 'src/repositories';
import { ColumnController } from './column.controller';
import { ColumnService } from './column.service';
import { TeamRepository } from 'src/repositories/team.repository';
import { TaskModule } from '../tasks/task.module';

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
