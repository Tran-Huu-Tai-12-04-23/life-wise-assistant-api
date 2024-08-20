import { SubTaskEntity } from 'src/entities/subTask.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(SubTaskEntity)
export class SubTaskRepository extends Repository<SubTaskEntity> {}
