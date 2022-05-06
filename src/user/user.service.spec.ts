import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let fakeUserRepo: Partial<Repository<User>>;

  beforeEach(async () => {
    fakeUserRepo = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'UserRepository',
          useValue: fakeUserRepo,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
