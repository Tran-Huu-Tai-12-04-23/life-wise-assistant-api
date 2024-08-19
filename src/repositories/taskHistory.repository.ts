import { TaskHistoryEntity } from 'src/entities/taskHistory.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(TaskHistoryEntity)
export class TaskHistoryRepository extends Repository<TaskHistoryEntity> {}
