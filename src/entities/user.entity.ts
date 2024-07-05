import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { compare, hash } from 'bcrypt';
import { UserDetailEntity } from './userDetail.entity';
import { TeamEntity } from './team.entity';
import { TaskEntity } from './task.entity';
import { BaseEntityCustom } from './base.entity';
@Entity(`Users`)
export class UserEntity extends BaseEntityCustom {
  @Column({ length: 500 })
  username: string;

  @Column({ length: 500 })
  password: string;

  @Column()
  avatar: string;

  @Column()
  verifyAt: Date;

  @Column()
  isActive: boolean;

  @Column({ default: 'MEMBER' })
  role: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const hashedPassword = await hash(this.password, 10);
      this.password = hashedPassword;
    }
  }

  comparePassword(candidate: string) {
    return compare(candidate, this.password);
  }

  @OneToOne(() => UserDetailEntity, (userDetail) => userDetail.user)
  userDetail: Promise<UserDetailEntity>;

  @ManyToMany(() => TeamEntity, (team) => team.members)
  @JoinColumn({ name: 'teamId', referencedColumnName: 'id' })
  teams: Promise<TeamEntity[]>;

  @ManyToMany(() => TaskEntity, (task) => task.lstMember)
  tasks: Promise<TaskEntity[]>;
}
