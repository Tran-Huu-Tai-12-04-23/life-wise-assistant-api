import { Injectable } from '@nestjs/common';
import { HISTORY_TYPE } from 'src/constants/enum-data';
import { HistoryEntity, UserEntity } from 'src/entities';
import { UserDetailEntity } from 'src/entities/userDetail.entity';
import {
  HistoryRepository,
  UserDetailRepository,
  UserRepository,
} from 'src/repositories';
import { UpdateUserDTO } from './dto';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly userDetailRepo: UserDetailRepository,
    private readonly historyRepo: HistoryRepository,
  ) {}

  async getProfile(user: UserEntity) {
    const userData = await this.userDetailRepo.findOne({
      where: { isDeleted: false, userId: user.id },
    });
    return {
      ...userData,
    };
  }

  async updateDetail(user: UserEntity, body: UpdateUserDTO) {
    return await this.userRepo.manager.transaction(async (transaction) => {
      const userRepo = transaction.getRepository(UserEntity);
      const userDetailRepo = transaction.getRepository(UserDetailEntity);
      const historyRepo = transaction.getRepository(HistoryEntity);

      const userDetailExist = await userDetailRepo.findOne({
        where: { userId: user.id, isDeleted: false },
      });
      const userDataExist = await userRepo.findOne({
        where: {
          id: user.id,
          isDeleted: false,
        },
      });

      if (!userDataExist) {
        throw new Error('User not found!');
      }

      if (!userDetailExist) {
        /// cretae new user detail
        const userDetail = new UserDetailEntity();
        userDetail.userId = user.id;
        userDetail.fullName = body.fullName;
        userDetail.address = body.address;
        userDetail.phoneNumber = body.phoneNumber;
        userDetail.email = body.email;
        userDetail.githubLink = body.githubLink;
        userDetail.telegramLink = body.telegramLink;
        userDetail.facebookLink = body.facebookLink;
        userDetail.bio = body.bio;
        userDetail.createdBy = user.id;
        userDetail.createdByName = user.username;
        userDetail.createdAt = new Date();

        await userDetailRepo.save(userDetail);
      } else {
        userDetailExist.fullName = body.fullName;
        userDetailExist.address = body.address;
        userDetailExist.phoneNumber = body.phoneNumber;
        userDetailExist.email = body.email;
        userDetailExist.githubLink = body.githubLink;
        userDetailExist.telegramLink = body.telegramLink;
        userDetailExist.facebookLink = body.facebookLink;
        userDetailExist.bio = body.bio;
        userDetailExist.updatedBy = user.id;
        await userDetailRepo.save(userDetailExist);
      }

      if (body.avatar) {
        userDataExist.avatar = body.avatar;
        await userRepo.save(userDataExist);
      }
      //#region  update history

      const history = new HistoryEntity();
      history.type = HISTORY_TYPE.USER_ACTION.code;
      history.content = 'Update user detail';
      history.createdBy = user.id;
      history.createdByName = user.username;
      history.targetActionId = user.id;
      await historyRepo.save(history);
      //#endregion

      return {
        message: "Update user's detail successfully",
      };
    });
  }
}
