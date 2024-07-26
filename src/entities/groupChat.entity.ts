import { IsBoolean, IsOptional, IsString } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { MessageEntity } from './message.entity';
import { UserEntity } from './user.entity';

@Entity(`GroupChats`)
export class GroupChatEntity extends BaseEntityCustom {
  @Column()
  @IsString()
  type: string;

  @Column()
  @IsOptional()
  name: string;

  @Column({ default: false })
  @IsBoolean()
  status: boolean;

  @ManyToOne(() => UserEntity, (user) => user.lstGroupChatIsOwner)
  @JoinColumn()
  owner: Promise<UserEntity>;

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
