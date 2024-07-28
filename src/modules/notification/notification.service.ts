import { Injectable } from '@nestjs/common';
import { NotificationRepository } from 'src/repositories';

@Injectable()
export class NotificationService {
  constructor(private notificationRepo: NotificationRepository) {}
}
