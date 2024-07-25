import { IsString } from 'class-validator';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { UserEntity } from './user.entity';

@Entity(`Notifications`)
export class NotificationEntity extends BaseEntityCustom {
  @Column()
  @IsString()
  title: string;

  @Column({ length: 10000 })
  @IsString()
  description: string;

  @Column()
  @IsString()
  type: string;

  @Column({ default: false })
  @IsString()
  isRead: boolean;

  @OneToMany(() => UserEntity, (user) => user.notifications)
  @JoinColumn()
  user: Promise<UserEntity>;
}
