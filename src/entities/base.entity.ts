import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/** Common fields */
export abstract class BaseEntityCustom extends BaseEntity {
  @ApiProperty({
    description: 'Primary key ID',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Creation date' })
  @Column({ nullable: false })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Creator, save user.id',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @Column({
    type: 'varchar',
    length: 36,
    nullable: true,
  })
  createdBy: string;

  @ApiProperty({ description: 'Creator, save user.fullName' })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  createdByName: string;

  @ApiProperty({ description: 'Last update date' })
  @Column({ nullable: true })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Last editor, save user.id',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @Column({ type: 'varchar', length: 36, nullable: true })
  updatedBy: string;

  @ApiProperty({
    description: 'Last deleted, save user.id',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @Column({ type: 'varchar', length: 36, nullable: true })
  deleteBy: string;

  @ApiProperty({ description: 'Soft delete?', example: false })
  @Column({ name: 'isDeleted', default: false })
  isDeleted: boolean;
}
