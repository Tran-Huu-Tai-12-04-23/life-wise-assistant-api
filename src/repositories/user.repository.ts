import { UserEntity } from 'src/entities';
import { UserDetailEntity } from 'src/entities/userDetail.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}
@CustomRepository(UserDetailEntity)
export class UserDetailRepository extends Repository<UserDetailEntity> {}
