import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { AuthService } from './auth.service';

const userTypeOrmModule = TypeOrmModule.forFeature([User]);

@Module({
  imports: [userTypeOrmModule],
  providers: [UserService, AuthService],
  controllers: [UserController],
})
export class UserModule {}
