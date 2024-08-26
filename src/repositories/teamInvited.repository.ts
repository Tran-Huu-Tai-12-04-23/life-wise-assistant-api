import { TeamInviteEntity } from 'src/entities/teamInvited.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(TeamInviteEntity)
export class TeamInviteRepository extends Repository<TeamInviteEntity> {}
