import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

import { UserService } from './user.service';

const scryptAsync = promisify(scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async isEmailAvailable(email: string) {
    const users = await this.userService.findAllByEmail(email);
    return users.length === 0;
  }

  async hashPassword(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${salt}.${buf.toString('hex')}`;
  }

  async signup(email: string, password: string) {
    const emailAvailable = await this.isEmailAvailable(email);
    if (!emailAvailable) throw new BadRequestException('Email already taken');

    const hashedPassword = await this.hashPassword(password);
    const user = await this.userService.create(email, hashedPassword);
    return user;
  }
}
