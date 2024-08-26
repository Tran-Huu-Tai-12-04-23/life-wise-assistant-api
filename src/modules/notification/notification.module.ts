import { Module } from '@nestjs/common';
import { NotificationRepository, UserRepository } from 'src/repositories';
import { TypeOrmExModule } from 'src/typeorm/typeorm-ex.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      NotificationRepository,
      UserRepository,
    ]),
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
