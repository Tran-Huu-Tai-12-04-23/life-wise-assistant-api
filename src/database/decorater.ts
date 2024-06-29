/* eslint-disable @typescript-eslint/ban-types */
import { SetMetadata } from '@nestjs/common';
import { TYPEORM_EX_CUSTOM_REPOSITORY } from './server-message';

export function CustomRepository(entity: Function): ClassDecorator {
  return SetMetadata(TYPEORM_EX_CUSTOM_REPOSITORY, entity);
}
