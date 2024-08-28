import { IsBoolean, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { TeamEntity } from './team.entity';
import { UserEntity } from './user.entity';

@Entity(`TeamPermissions`)
export class TeamPermissionEntity extends BaseEntityCustom {
  @Column({ default: false })
  @IsBoolean()
  isAdmin: boolean;

  @Column({ default: false })
  @IsBoolean()
  isEdit: boolean;

  @Column({ default: false })
  @IsBoolean()
  isDelete: boolean;

  @Column({ default: false })
  @IsBoolean()
  isCreate: boolean;

  @Column({ default: false })
  @IsBoolean()
  isAssign: boolean;

  @Column({ default: false })
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
