import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { TaskEntity } from './task.entity';

@Entity(`SubTasks`)
export class SubTaskEntity extends BaseEntityCustom {
  @Column()
  name: string;

  @Column()
  taskId: string;
  @ManyToOne(() => TaskEntity, (task) => task.subTasks)
  @JoinColumn({ name: 'taskId', referencedColumnName: 'id' })
  task: Promise<TaskEntity>;

  @Column()
  isChecked: boolean;
}
