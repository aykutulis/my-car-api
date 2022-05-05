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
  UnauthorizedException,
  Session,
} from '@nestjs/common';

import { CreateUserDto, UpdateUserDto, UserDto } from './dtos';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize-interceptor';

@Controller('/auth')
@Serialize(UserDto)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('/me')
  async me(@Session() session: Record<string, unknown>) {
    const userId = session.userId as string | undefined | null;
    if (!userId) {
      session.userId = null;
      throw new UnauthorizedException('User not found');
    }
    const user = await this.userService.findById(parseInt(userId));
    if (!user) {
      session.userId = null;
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  @Post('/signup')
  async createUser(
    @Body() body: CreateUserDto,
    @Session() session: Record<string, unknown>,
  ) {
    const { email, password } = body;
    const user = await this.authService.signup(email, password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(
    @Body() body: CreateUserDto,
    @Session() session: Record<string, unknown>,
  ) {
    const { email, password } = body;
    const user = await this.authService.signin(email, password);
    session.userId = user.id;
    return user;
  }

  @Get('/signout')
  async signout(@Session() session: Record<string, unknown>) {
    session.userId = null;
    return 'Signout success';
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findById(parseInt(id));
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.findAllByEmail(email);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}
