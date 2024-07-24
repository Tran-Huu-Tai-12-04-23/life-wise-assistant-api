import { IsString } from 'class-validator';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { GroupChatEntity } from './group-chat.entity';
import { UserEntity } from './user.entity';

@Entity(`Messages`)
export class MessageEntity extends BaseEntity {
  @Column()
  @IsString()
  content: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: Promise<UserEntity>;

  @Column({ default: false })
  @IsString()
  isRead: boolean;

  @ManyToOne(() => GroupChatEntity, (groupChat) => groupChat.messages)
  groupChat: Promise<GroupChatEntity>;
}
