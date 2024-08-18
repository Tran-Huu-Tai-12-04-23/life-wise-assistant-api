import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { TaskEntity } from './task.entity';

@Entity(`TaskHistory`)
export class TaskHistoryEntity extends BaseEntityCustom {
  @Column()
  title: string;

  @Column({ length: 10000 })
  description: string;

  @Column()
  taskId: string;
  @ManyToOne(() => TaskEntity, (task) => task.history)
  @JoinColumn({ name: 'taskId', referencedColumnName: 'id' })
  task: TaskEntity;
}
