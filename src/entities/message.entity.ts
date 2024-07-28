import { IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { GroupChatEntity } from './groupChat.entity';
import { UserEntity } from './user.entity';

@Entity(`Messages`)
export class MessageEntity extends BaseEntityCustom {
  @Column()
  @IsString()
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.messageSend)
  @JoinColumn()
  owner: Promise<UserEntity>;

  @Column({ default: false })
  @IsString()
  isRead: boolean;

  @ManyToOne(() => GroupChatEntity, (groupChat) => groupChat.messages)
  @JoinColumn()
  groupChat: Promise<GroupChatEntity>;
}
