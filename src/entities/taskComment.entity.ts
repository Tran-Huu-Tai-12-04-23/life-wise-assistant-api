import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { TaskEntity } from './task.entity';
import { UserEntity } from './user.entity';

@Entity(`TaskComment`)
export class TaskCommentEntity extends BaseEntityCustom {
  @Column()
  content: string;

  @Column()
  userId: string;
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  owner: Promise<UserEntity>;

  @Column()
  taskId: string;
  @ManyToOne(() => TaskEntity, (task) => task.comments)
  @JoinColumn({ name: 'taskId', referencedColumnName: 'id' })
  task: Promise<TaskEntity>;
}
