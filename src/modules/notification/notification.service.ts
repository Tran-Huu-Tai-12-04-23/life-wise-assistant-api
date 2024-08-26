import { Injectable } from '@nestjs/common';
import { NOTIFICATION_TYPE } from 'src/constants/enum-data';
import { NotificationEntity, UserEntity } from 'src/entities';
import { NotificationRepository } from 'src/repositories';
import { PaginationDTO } from '../dto';
import {
  NotificationTeamInviteToCreateDTO,
  NotificationToCreateDTO,
} from './dto';

@Injectable()
export class NotificationService {
  constructor(private notificationRepo: NotificationRepository) {}

  async notificationPagination(data: PaginationDTO, user: UserEntity) {
    const result = await this.notificationRepo.findAndCount({
      where: { userId: user.id, isDeleted: false },
      order: { createdAt: 'DESC' },
      take: data.take,
      skip: data.skip,
    });

    const dataResult = result[0].map((item) => {
      const notificationType = NOTIFICATION_TYPE[item.type as 'ASSIGN_TASK'];
      const isInviteNotification =
        item.type === NOTIFICATION_TYPE.INVITE_TEAM.code;
      return {
        ...item,
        notificationTypeName: notificationType?.name,
        notificationTypeColor: notificationType?.color,
        notificationTypeBackground: notificationType?.background,
        notificationType,
        isInviteNotification,
      };
    });

    const isHasNextPage = result[1] > data.skip + data.take;

    return [dataResult, result[1], isHasNextPage];
  }

  async createData(
    data: NotificationToCreateDTO,
    repo?: NotificationRepository,
  ) {
    const notify = new NotificationEntity();
    notify.title = data.title;
    notify.description = data.description || '';
    notify.subTitle = data.subTitle;
    notify.type = data.type;
    notify.linkTarget = data.linkTarget;
    notify.userId = data.userId;
    notify.createdAt = new Date();
    notify.createdBy = data.createdBy;
    notify.createdByName = data.userId;
    return repo
      ? await repo.save(data)
      : await this.notificationRepo.save(data);
  }

  async createTeamInvite(
    data: NotificationTeamInviteToCreateDTO,
    repo?: NotificationRepository,
  ) {
    const notify = new NotificationEntity();
    notify.title = data.title;
    notify.description = data.description || '';
    notify.subTitle = data.subTitle;
    notify.type = data.type;
    notify.linkTarget = data.linkTarget;
    notify.userId = data.userId;
    notify.teamInviteId = data.teamInviteId;
    notify.createdAt = new Date();
    notify.createdBy = data.createdBy;
    notify.createdByName = data.userId;
    notify.teamInviteId = data.teamInviteId;
    return repo ? repo.save(data) : await this.notificationRepo.save(data);
  }
}
