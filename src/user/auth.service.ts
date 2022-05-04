import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  generateSalt() {
    return randomBytes(8).toString('hex');
  }

  async generateHashBuffer(password: string, salt: string) {
    return (await scryptAsync(password, salt, 64)) as Buffer;
  }

  async hashPassword(password: string, salt?: string) {
    const _salt = salt ?? this.generateSalt();
    const buf = await this.generateHashBuffer(password, _salt);
    return `${_salt}.${buf.toString('hex')}`;
  }

  async signup(email: string, password: string) {
    const emailAvailable = await this.isEmailAvailable(email);
    if (!emailAvailable) throw new BadRequestException('Email already taken');

    const hashedPassword = await this.hashPassword(password);
    const user = await this.userService.create(email, hashedPassword);
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.findAllByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const [salt, hashedPassword] = user.password.split('.');
    const passBuffer = await this.generateHashBuffer(password, salt);

    if (hashedPassword !== passBuffer.toString('hex')) {
      throw new BadRequestException('Invalid password');
    }

    return user;
  }
}
