import { MessageEntity } from 'src/entities/message.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(MessageEntity)
export class MessageRepository extends Repository<MessageEntity> {}
