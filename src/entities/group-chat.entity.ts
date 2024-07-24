import { IsBoolean, IsString } from 'class-validator';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { MessageEntity } from './message';
import { UserEntity } from './user.entity';

@Entity(`GroupChats`)
export class GroupChatEntity {
  @Column()
  @IsString()
  type: string;

  @Column({ default: false })
  @IsBoolean()
  status: boolean;

  @Column()
  @IsString()
  socketId: string;

  @ManyToMany(() => UserEntity, (user) => user.lstGroupChat)
  @Column()
  lstMember: Promise<UserEntity[]>;

  @OneToMany(() => MessageEntity, (message) => message.groupChat)
  messages: Promise<MessageEntity[]>;
}
