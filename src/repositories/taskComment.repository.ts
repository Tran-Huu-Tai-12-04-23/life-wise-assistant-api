import { TaskCommentEntity } from 'src/entities/taskComment.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(TaskCommentEntity)
export class TaskCommentRepository extends Repository<TaskCommentEntity> {}
