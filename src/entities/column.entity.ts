import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { TaskEntity } from './task.entity';
import { BaseEntityCustom } from './base.entity';
import { TeamEntity } from './team.entity';

@Entity(`Columns`)
export class ColumnEntity extends BaseEntityCustom {
  @Column()
  name: string;

  @Column({ default: 0 })
  totalTask: number;

  @Column()
  statusCode: string;

  @Column()
  index: number;

  @OneToMany(() => TaskEntity, (task) => task.column)
  tasks: Promise<TaskEntity[]>;

  @BeforeInsert()
  async beforeInsert() {
    this.totalTask = await this.tasks.then((tasks) => tasks.length);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async updateTotalTask() {
    if (this.tasks) {
      this.totalTask = (await this.tasks).length;
    } else {
      this.totalTask = 0;
    }
  }

  @ManyToOne(() => TeamEntity, (team) => team.columns)
  team: Promise<TeamEntity>;
}
