import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator(
  (data: string | string[], ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user)
      throw new InternalServerErrorException('User not found (request)');

    if (!data) return user;

    return (Array.isArray(data) ? data : [data]).reduce((acc, key) => {
      if (user.hasOwnProperty(key)) {
        acc[key] = user[key];
      }
      return acc;
    }, new User());
  },
);
