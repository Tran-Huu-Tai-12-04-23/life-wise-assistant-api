import { Module } from '@nestjs/common';
import {
  HistoryRepository,
  UserDetailRepository,
  UserRepository,
} from 'src/repositories';
import { TypeOrmExModule } from 'src/typeorm/typeorm-ex.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      UserDetailRepository,
      HistoryRepository,
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
