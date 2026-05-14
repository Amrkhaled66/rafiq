import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthorizationGuard } from '../authorization/authorization.guard';
import { CurrentUser } from '../authorization/decorators/current-user.decorator';
import { RequirePolicy } from '../authorization/decorators/require-policy.decorator';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getMe(user.sub);
  }

  // @Get()
  // @RequirePolicy('users.list')
  // listUsers(
  //   @CurrentUser() user: AuthenticatedUser,
  //   @Query() query: ListUsersQueryDto,
  // ) {
  //   return this.usersService.listUsers(user, query);
  // }

  @Get(':id')
  @RequirePolicy('users.read')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }

  @Post()
  @RequirePolicy('users.create')
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Patch(':id')
  @RequirePolicy('users.update')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, dto, user);
  }

  @Delete(':id')
  @RequirePolicy('users.delete')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.softDeleteUser(id);
    return { success: true };
  }
}
