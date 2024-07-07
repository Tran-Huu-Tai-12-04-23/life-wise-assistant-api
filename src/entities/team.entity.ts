import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntityCustom } from './base.entity';
import { ColumnEntity } from './column.entity';

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

  @ManyToMany(() => UserEntity, (user) => user.teams)
  @JoinTable()
  members: Promise<UserEntity[]>;

  @OneToMany(() => ColumnEntity, (column) => column.team)
  @JoinColumn({ name: 'teamId', referencedColumnName: 'id' })
  columns: Promise<ColumnEntity[]>;
}
