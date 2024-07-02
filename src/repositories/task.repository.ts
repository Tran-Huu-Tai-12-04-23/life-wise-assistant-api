import { TaskEntity } from 'src/entities/task.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(TaskEntity)
export class TaskRepository extends Repository<TaskRepository> {}
