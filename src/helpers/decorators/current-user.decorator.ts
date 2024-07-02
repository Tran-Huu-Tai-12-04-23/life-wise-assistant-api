import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserEntity } from 'src/entities';

/** Lấy thông tin user đang request */
export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return plainToClass(UserEntity, request.user);
  },
);
