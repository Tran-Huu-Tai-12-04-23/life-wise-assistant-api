import { TaskFileEntity } from 'src/entities/taskFile.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(TaskFileEntity)
export class TaskFileRepository extends Repository<TaskFileEntity> {}
