import { IsString } from 'class-validator';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { UserEntity } from './user.entity';

@Entity(`Notifications`)
export class NotificationEntity extends BaseEntityCustom {
  @Column()
  @IsString()
  title: string;

  @Column()
  @IsString()
  subTitle: string;

  @Column({ length: 10000 })
  @IsString()
  description: string;

  @Column()
  @IsString()
  type: string;

  @Column({ default: false })
  @IsString()
  isRead: boolean;

  @Column()
  @IsString()
  linkTarget: string;

  @Column()
  @IsString()
  userId: string;

  @OneToMany(() => UserEntity, (user) => user.notifications)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: Promise<UserEntity>;

  @Column({ nullable: true })
  @IsString()
  teamInviteId: string;
}
