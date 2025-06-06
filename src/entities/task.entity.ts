import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
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
  @Column({ default: 'MEDIUM' })
  priority: string;
  @Column({ default: 'TASK' })
  type: string;
  @Column({ default: 'TO_ASSIGN' })
  status: string;
  @Column({ default: '' })
  fileLink: string;
  @Column({ default: '' })
  cmdCheckOutBranch: string;
  @Column({ default: '' })
  cmdCommit: string;
  @Column({ default: '' })
  sourceCodeLink: string;
  @Column()
  index: number;
  @ManyToMany(() => UserEntity, (user) => user)
  @JoinTable()
  lstPersonInCharge: Promise<UserEntity[]>;
  @ManyToOne(() => ColumnEntity, (column) => column.tasks)
  @JoinColumn({ name: 'columnId', referencedColumnName: 'id' })
  column: Promise<ColumnEntity>;
}
