import { IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { BaseEntityCustom } from './base.entity';

@Entity(`History`)
export class HistoryEntity extends BaseEntityCustom {
  @Column()
  @IsString()
  type: string;

  @Column()
  @IsString()
  content: string;

  @Column()
  @IsString()
  targetActionId: string;
  // example : history about create group chat => targetActionId = groupChatId
}
