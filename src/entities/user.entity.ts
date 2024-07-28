import { compare, hash } from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { GroupChatEntity } from './groupChat.entity';
import { MessageEntity } from './message.entity';
import { NotificationEntity } from './notification.entity';
import { TaskEntity } from './task.entity';
import { TeamEntity } from './team.entity';
import { UserDetailEntity } from './userDetail.entity';
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

  @OneToMany(() => MessageEntity, (mess) => mess.owner)
  messageSend: Promise<MessageEntity[]>;

  @ManyToMany(() => TeamEntity, (team) => team.members)
  @JoinColumn({ name: 'teamId', referencedColumnName: 'id' })
  teams: Promise<TeamEntity[]>;

  @ManyToMany(() => TaskEntity, (task) => task.lstPersonInCharge)
  tasks: Promise<TaskEntity[]>;

  @ManyToMany(() => GroupChatEntity, (gr) => gr.lstMember)
  lstGroupChat: Promise<GroupChatEntity[]>;

  @ManyToOne(() => NotificationEntity, (noti) => noti.user)
  notifications: Promise<NotificationEntity[]>;

  @OneToMany(() => GroupChatEntity, (gr) => gr.owner)
  @JoinTable()
  lstGroupChatIsOwner: Promise<GroupChatEntity[]>;
}
