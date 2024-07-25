import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity(`Devices`)
export class DeviceEntity {
  @ApiProperty({
    description: 'Primary key ID',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  type: string;

  @Column({ default: false })
  @IsBoolean()
  status: boolean;

  @Column()
  @IsString()
  socketId: string;

  @OneToOne(() => UserEntity, (pr) => pr.device)
  @JoinColumn()
  user: Promise<UserEntity>;
}
