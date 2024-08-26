import { IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { TeamEntity } from './team.entity';
import { UserEntity } from './user.entity';

@Entity(`TeamInvites`)
export class TeamInviteEntity extends BaseEntityCustom {
  @Column()
  @IsString()
  userId: string;
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: Promise<UserEntity>;

  @Column()
  @IsString()
  teamId: string;
  @ManyToOne(() => TeamEntity)
  @JoinColumn({ name: 'teamId', referencedColumnName: 'id' })
  team: Promise<TeamEntity>;
}
