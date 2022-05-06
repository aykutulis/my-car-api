import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UserService>;

  beforeEach(async () => {
    fakeUserService = {
      findAllByEmail: () => Promise.resolve([] as User[]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create a new user with a salted and hashed password', async () => {
    const user = await service.signup('asd@asd.com', '123456');

    expect(user.password).not.toEqual('123456');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws error if user already exists', async () => {
    fakeUserService.findAllByEmail = () =>
      Promise.resolve([{ id: 1, email: 'asd@asd.com', password: '123456' }]);

    await expect(service.signup('asd@asd.com', '123456')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws error if user not found', async () => {
    await expect(service.signin('asd@asd.com', '123456')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws error if password is invalid', async () => {
    const password = '123456';
    const hashedPassword = await service.hashPassword(password);

    fakeUserService.findAllByEmail = () =>
      Promise.resolve([
        { id: 1, email: 'asd@asd.com', password: hashedPassword },
      ]);

    await expect(service.signin('asd@asd.com', '1234567')).rejects.toThrow(
      new BadRequestException('Invalid password'),
    );
  });

  it('returns a user if correct password is provided', async () => {
    const password = '123456';
    const hashedPassword = await service.hashPassword(password);

    fakeUserService.findAllByEmail = () =>
      Promise.resolve([
        { id: 1, email: 'asd@asd.com', password: hashedPassword },
      ]);

    const user = service.signin('asd@asd.com', password);

    expect(user).toBeDefined();
  });
});
