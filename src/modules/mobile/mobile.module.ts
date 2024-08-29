import { Module } from '@nestjs/common';
import { TaskService } from '../tasks/task.service';
import { MobileController } from './mobile.controller';
import { MobileService } from './module.service';

@Module({
  imports: [],
  providers: [TaskService],
  controllers: [MobileController],
  exports: [MobileService],
})
export class MobileModule {}
