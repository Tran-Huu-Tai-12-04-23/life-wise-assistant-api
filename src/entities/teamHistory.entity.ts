import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { TeamEntity } from './team.entity';
import { UserEntity } from './user.entity';

@Entity(`TeamHistory`)
export class TeamHistoryEntity extends BaseEntityCustom {
  @Column()
  title: string;

  @Column({ length: 10000 })
  description: string;

  @Column()
  teamId: string;

  @ManyToOne(() => TeamEntity, (task) => task.history)
  @JoinColumn({ name: 'teamId', referencedColumnName: 'id' })
  team: Promise<TeamEntity>;

  @Column()
  ownerId: string;
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'ownerId', referencedColumnName: 'id' })
  owner: UserEntity;
}
