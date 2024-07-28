import { UserEntity } from 'src/entities';

export class Device {
  socketId: string;
  status: boolean;
  user: UserEntity;
  type: string;
}
