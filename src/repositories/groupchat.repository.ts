import { GroupChatEntity } from 'src/entities/group-chat.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(GroupChatEntity)
export class GroupChatRepository extends Repository<GroupChatEntity> {}
