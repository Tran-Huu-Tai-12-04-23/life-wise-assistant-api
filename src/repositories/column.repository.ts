import { ColumnEntity } from 'src/entities/column.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(ColumnEntity)
export class ColumnRepository extends Repository<ColumnEntity> {}
