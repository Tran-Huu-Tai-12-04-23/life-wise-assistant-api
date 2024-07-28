import { HistoryEntity } from 'src/entities/history.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(HistoryEntity)
export class HistoryRepository extends Repository<HistoryEntity> {}
