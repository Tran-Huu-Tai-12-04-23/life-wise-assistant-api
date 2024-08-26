import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { TaskEntity } from './task.entity';

@Entity(`TaskFile`)
export class TaskFileEntity extends BaseEntityCustom {
  @Column()
  fileLink: string;
  @Column()
  name: string;

  @Column()
  taskId: string;
  @ManyToOne(() => TaskEntity, (task) => task.taskFiles)
  @JoinColumn({ name: 'taskId', referencedColumnName: 'id' })
  task: Promise<TaskEntity>;
}
