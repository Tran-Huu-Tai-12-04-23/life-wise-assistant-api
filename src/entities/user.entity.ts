import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { compare, hash } from 'bcrypt';
@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  username: string;

  @Column({ length: 500 })
  password: string;

  @Column()
  avatar: string;

  @Column()
  verifyAt: Date;

  @Column()
  isActive: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const hashedPassword = await hash(this.password, 10);
      this.password = hashedPassword;
    }
  }

  comparePassword(candidate: string) {
    return compare(candidate, this.password);
  }
}
