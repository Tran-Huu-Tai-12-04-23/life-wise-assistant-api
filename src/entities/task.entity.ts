import { Column, Entity, JoinColumn, ManyToMany, OneToMany } from 'typeorm';
import { ColumnEntity } from './column.entity';
import { UserEntity } from './user.entity';
import { BaseEntityCustom } from './base.entity';

@Entity(`Tasks`)
export class TaskEntity extends BaseEntityCustom {
  @Column()
  title: string;
  @Column({ length: 10000 })
  description: string;
  @Column()
  dateExpire: Date;
  @Column()
  priority: string;
  @Column()
  type: string;
  @Column()
  status: string;
  @Column()
  cmdCommit: string;
  @Column()
  cmdCheckOutBranch: string;
  @Column()
  sourceCodeLink: string;
  @ManyToMany(() => UserEntity, (user) => user)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  lstMember: Promise<UserEntity[]>;
  @OneToMany(() => ColumnEntity, (column) => column.tasks)
  @JoinColumn({ name: 'columnId', referencedColumnName: 'id' })
  column: Promise<ColumnEntity>;
}
