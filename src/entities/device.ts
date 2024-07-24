import { IsBoolean, IsString } from 'class-validator';
import { Column, Entity, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity(`Devices`)
export class DeviceEntity {
  @Column()
  @IsString()
  type: string;

  @Column({ default: false })
  @IsBoolean()
  status: boolean;

  @Column()
  @IsString()
  socketId: string;

  @OneToOne(() => UserEntity)
  @Column()
  user: UserEntity;
}
