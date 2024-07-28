import { NotificationEntity } from 'src/entities/notification.entity';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(NotificationEntity)
export class NotificationRepository extends Repository<NotificationEntity> {}
