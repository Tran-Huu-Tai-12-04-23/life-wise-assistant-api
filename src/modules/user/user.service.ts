import { Injectable } from '@nestjs/common';
import { HISTORY_TYPE } from 'src/constants/enum-data';
import { HistoryEntity, UserEntity } from 'src/entities';
import {
  HistoryRepository,
  UserDetailRepository,
  UserRepository,
} from 'src/repositories';
import { TaskHistoryRepository } from 'src/repositories/taskHistory.repository';
import { UpdateUserDTO } from './dto';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly userDetailRepo: UserDetailRepository,
    private readonly taskHistoryRepo: TaskHistoryRepository,
    private readonly historyRepo: HistoryRepository,
  ) {}

  async getProfile(user: UserEntity) {
    const [taskUserHistory, historyData] = await Promise.all([
      this.taskHistoryRepo.find({
        where: {
          isDeleted: false,
          createdBy: user.id,
        },
      }),
      this.historyRepo.find({
        where: { isDeleted: false, createdBy: user.id },
      }),
    ]);

    return {
      profile: user,
      taskHistory: taskUserHistory,
      history: historyData,
    };
  }

  async updateDetail(user: UserEntity, body: UpdateUserDTO) {
    const userExist = await this.userDetailRepo.findOne({
      where: { id: user.id, isDeleted: false },
    });

    if (!userExist) {
      throw new Error('User not found!');
    }

    userExist.fullName = body.fullName;
    userExist.address = body.address;
    userExist.phoneNumber = body.phoneNumber;
    userExist.email = body.email;
    userExist.githubLink = body.githubLink;
    userExist.telegramLink = body.telegramLink;
    userExist.facebookLink = body.facebookLink;
    userExist.bio = body.bio;
    userExist.updatedBy = user.id;

    //#region  update history

    const history = new HistoryEntity();
    history.type = HISTORY_TYPE.USER_ACTION.code;
    history.content = 'Update user detail';
    history.createdBy = user.id;
    history.createdByName = user.username;
    history.targetActionId = user.id;
    await this.historyRepo.save(history);
    //#endregion

    await this.userDetailRepo.save(userExist);

    return {
      message: "Update user's detail successfully",
    };
  }
}
