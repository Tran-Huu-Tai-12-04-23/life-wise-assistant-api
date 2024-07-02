import { TeamEntity } from './../entities/team.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(TeamEntity)
export class TeamRepository extends Repository<TeamEntity> {}
