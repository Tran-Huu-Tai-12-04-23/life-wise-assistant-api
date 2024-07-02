import { Column, Entity, ManyToMany } from 'typeorm';
import { TaskEntity } from './task.entity';
import { BaseEntityCustom } from './base.entity';

@Entity(`Columns`)
export class ColumnEntity extends BaseEntityCustom {
  @Column()
  name: string;

  @ManyToMany(() => TaskEntity, (task) => task.column)
  tasks: Promise<TaskEntity[]>;
}
