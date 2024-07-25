import { IsBoolean, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { MessageEntity } from './message.entity';
import { UserEntity } from './user.entity';

@Entity(`GroupChats`)
export class GroupChatEntity extends BaseEntityCustom {
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
  @JoinColumn()
  lstMember: Promise<UserEntity[]>;

  @OneToMany(() => MessageEntity, (message) => message.groupChat)
  @JoinColumn()
  messages: Promise<MessageEntity[]>;
}
