import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { ColumnEntity } from './column.entity';
import { TeamHistoryEntity } from './teamHistory.entity';
import { TeamPermissionEntity } from './teamPermission.entity';
import { UserEntity } from './user.entity';

@Entity(`Teams`)
export class TeamEntity extends BaseEntityCustom {
  @Column()
  name: string;

  @Column()
  thumbnails: string;

  @Column({ length: 500 })
  description: string;

  @Column()
  tags: string;

  @Column()
  isWorkPlace: boolean;

  @ApiProperty({ description: 'Invite token' })
  @Column({ nullable: true })
  inviteToken: string;

  @ApiProperty({ description: 'Invite token expired date' })
  @CreateDateColumn()
  inviteTokenExpiredDate: Date;

  @ManyToMany(() => UserEntity, (user) => user.teams)
  @JoinTable()
  members: Promise<UserEntity[]>;

  @OneToMany(() => ColumnEntity, (column) => column.team)
  @JoinColumn({ name: 'teamId', referencedColumnName: 'id' })
  columns: Promise<ColumnEntity[]>;

  @OneToMany(() => TeamPermissionEntity, (permission) => permission.team)
  permission: Promise<TeamPermissionEntity[]>;

  @OneToMany(() => TeamHistoryEntity, (his) => his.team)
  history: Promise<TeamHistoryEntity[]>;
}
