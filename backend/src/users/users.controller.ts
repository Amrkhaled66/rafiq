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
import { Authorize } from '../authorization/decorators/authorize.decorator';
import { CurrentUser } from '../authorization/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

const resource = 'user';

@Controller('users')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getMe(user.sub);
  }

  @Get()
  @Authorize({
    action: 'read',
    resource,
  })
  listUsers(@Query() query: ListUsersQueryDto) {
    return this.usersService.listUsers(query);
  }

  @Get(':id')
  @Authorize({
    action: 'read',
    resource,
    lookup: { key: 'id', kind: 'resourceId', source: 'params' },
  })
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }

  @Post()
  @Authorize({
    action: 'create',
    resource,
  })
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Patch(':id')
  @Authorize({
    action: 'update',
    resource,
    lookup: { key: 'id', kind: 'resourceId', source: 'params' },
  })
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, dto, user);
  }

  @Delete(':id')
  @Authorize({
    action: 'delete',
    resource,
    lookup: { key: 'id', kind: 'resourceId', source: 'params' },
  })
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.softDeleteUser(id);
    return { success: true };
  }
}
