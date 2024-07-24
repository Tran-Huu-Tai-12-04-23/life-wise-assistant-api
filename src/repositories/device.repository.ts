import { DeviceEntity } from 'src/entities/device';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(DeviceEntity)
export class DeviceRepository extends Repository<DeviceEntity> {}
