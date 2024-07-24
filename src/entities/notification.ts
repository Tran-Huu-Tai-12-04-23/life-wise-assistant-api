import { IsString } from 'class-validator';
import { enumData } from 'src/constants/enum-data';
import { Column, Entity, OneToOne } from 'typeorm';
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
  type: keyof typeof enumData.NOTIFICATION_TYPE;

  @Column({ default: false })
  @IsString()
  isRead: boolean;

  @OneToOne(() => UserEntity)
  userTarget: Promise<UserEntity>;
}
