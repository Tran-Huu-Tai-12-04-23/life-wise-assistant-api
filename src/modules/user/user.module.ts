import { Module } from '@nestjs/common';
import { HistoryEntity } from 'src/entities';
import { TaskHistoryEntity } from 'src/entities/taskHistory.entity';
import { TypeOrmExModule } from 'src/typeorm/typeorm-ex.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([TaskHistoryEntity, HistoryEntity]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
