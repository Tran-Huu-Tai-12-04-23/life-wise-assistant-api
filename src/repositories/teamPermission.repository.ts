import { TeamPermissionEntity } from 'src/entities/teamPermission.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(TeamPermissionEntity)
export class TeamPermissionRepository extends Repository<TeamPermissionEntity> {}
