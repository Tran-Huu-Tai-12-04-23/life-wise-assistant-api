import { Module } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';
import { TypeOrmExModule } from 'src/typeorm/typeorm-ex.module';
import { TeamRepository } from 'src/repositories/team.repository';
import { TeamsService } from './team.service';
import { TeamController } from './team.controller';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([TeamRepository, UserRepository]),
  ],
  providers: [TeamsService],
  controllers: [TeamController],
  exports: [TeamsService],
})
export class TeamModule {}
