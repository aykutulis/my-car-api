import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { User } from '../user.entity';

import { UserService } from '../user.service';

type RequestWithUser = Request & { currentUser?: User };

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    const userId = req.session?.userId;

    if (userId) {
      const user = await this.userService.findById(userId);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      req.currentUser = user;
    }

    next();
  }
}
