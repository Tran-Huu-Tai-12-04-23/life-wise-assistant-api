import { IsBoolean, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { TeamEntity } from './team.entity';
import { UserEntity } from './user.entity';

@Entity(`TeamPermissions`)
export class TeamPermissionEntity extends BaseEntityCustom {
  @Column()
  @IsBoolean()
  isAdmin: boolean;

  @Column()
  @IsBoolean()
  isEdit: boolean;

  @Column()
  @IsBoolean()
  isDelete: boolean;

  @Column()
  @IsBoolean()
  isCreate: boolean;

  @Column()
  @IsBoolean()
  isAssign: boolean;

  @Column()
  @IsBoolean()
  isInvite: boolean;

  @Column()
  @IsString()
  userId: string;
  @ManyToOne(() => UserEntity, (user) => user.teamPermissions)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: Promise<UserEntity>;

  @Column()
  @IsString()
  teamId: string;

  @ManyToOne(() => TeamEntity, (team) => team.permission)
  @JoinColumn({ name: 'teamId', referencedColumnName: 'id' })
  team: Promise<TeamEntity>;
}
