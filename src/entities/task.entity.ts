import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { ColumnEntity } from './column.entity';
import { SubTaskEntity } from './subTask.entity';
import { TaskCommentEntity } from './taskComment.entity';
import { TaskFileEntity } from './taskFile.entity';
import { TaskHistoryEntity } from './taskHistory.entity';
import { UserEntity } from './user.entity';

@Entity(`Tasks`)
export class TaskEntity extends BaseEntityCustom {
  @Column()
  title: string;
  @Column({ length: 10000 })
  description: string;
  @Column()
  expireDate: Date;
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

  @OneToMany(() => SubTaskEntity, (subTask) => subTask.task)
  subTasks: Promise<SubTaskEntity[]>;

  @OneToMany(() => TaskHistoryEntity, (taskHistory) => taskHistory.task)
  history: Promise<TaskHistoryEntity[]>;

  @OneToMany(() => TaskCommentEntity, (taskComment) => taskComment.task)
  comments: Promise<TaskCommentEntity[]>;

  @OneToMany(() => TaskFileEntity, (taskFile) => taskFile.task)
  taskFiles: Promise<TaskFileEntity[]>;
}
