import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDto, UpdateUserDto, UserDto } from './dtos';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize-interceptor';

@Controller('auth')
@Serialize(UserDto)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  createUser(@Body() body: CreateUserDto) {
    const { email, password } = body;
    return this.authService.signup(email, password);
  }

  @Get(':id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findById(parseInt(id));
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.findAllByEmail(email);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}
