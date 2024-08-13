import { Module } from '@nestjs/common';
import { ColumnRepository, TaskRepository } from 'src/repositories';
import { TeamRepository } from 'src/repositories/team.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { TypeOrmExModule } from 'src/typeorm/typeorm-ex.module';
import { ColumnService } from '../columns/column.service';
import { TeamController } from './team.controller';
import { TeamsService } from './team.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      TeamRepository,
      UserRepository,
      ColumnRepository,
      TaskRepository,
    ]),
  ],
  providers: [TeamsService, ColumnService],
  controllers: [TeamController],
  exports: [TeamsService],
})
export class TeamModule {}
