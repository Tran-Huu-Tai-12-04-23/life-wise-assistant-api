import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntityCustom } from './base.entity';
@Entity(`UserDetails`)
export class UserDetailEntity extends BaseEntityCustom {
  @Column({ length: 500 })
  fullName: string;
  @Column({ length: 500 })
  address: string;
  @Column({ length: 500 })
  phoneNumber: string;
  @Column({ length: 500 })
  email: string;
  @Column({ length: 500 })
  githubLink: string;
  @Column({ length: 500 })
  telegramLink: string;
  @Column({ length: 500 })
  facebookLink: string;
  @Column({ length: 500 })
  bio: string;
  @OneToOne(() => UserEntity, (p) => p.userDetail)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: Promise<UserEntity>;
}
