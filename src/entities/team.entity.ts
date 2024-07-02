import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntityCustom } from './base.entity';

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

  @ManyToMany(() => UserEntity, (user) => user.teams)
  @JoinTable()
  users: Promise<UserEntity[]>;
}
