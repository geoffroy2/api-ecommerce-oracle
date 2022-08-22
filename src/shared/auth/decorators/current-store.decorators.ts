import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Store } from 'src/store/entities/store.entity';

export const CurrentStore = createParamDecorator(
  (data, context: ExecutionContext): Store => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);
