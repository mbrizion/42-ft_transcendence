import {
  Controller,
  MaxFileSizeValidator,
  Post,
  Get,
  Put,
  UploadedFile,
  Body,
  ParseFilePipe,
  FileTypeValidator,
  UseInterceptors,
  UseGuards,
  Query,
  Req
} from '@nestjs/common';

import { Express, Request } from 'express';
import { UserService } from './user.service';
import { Res } from '@nestjs/common';
import { UserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators';
import { User } from '@prisma/client';
// clean dependencies + unused dtos

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getUser(@GetUser() user: UserDto) {
    return user; // by now returns the token
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getEmail')
  getEmail(@GetUser() user: UserDto) {
    return user.email;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('users')
  getUsers(@GetUser() user: UserDto) {
    return this.userService.getUsers(user);
  }

  // DisplayName
  @UseGuards(AuthGuard('jwt'))
  @Get('getName')
  getName(@GetUser() user: UserDto) {
    return user.displayName;
  }

  // DisplaySocketId
  @UseGuards(AuthGuard('jwt'))
  @Get('receivedfriendRequest')
  getreceivedfriendRequest(@GetUser() user: UserDto) {
    return this.userService.pendingFriend(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('friendslist')
  getFriends(@GetUser() user: UserDto) {
    return this.userService.friendsList(user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('friendslistById/:id')
  async getFriendsById(@Query() queryParams) {
    let user = await this.userService.getUserById(Number(queryParams.id));
    let users = await this.userService.friendsList(user.id);
    return users;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('socketId')
  getSocketId(@GetUser() user: UserDto) {
    return user.socketId;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('modifyName')
  modifyName(@GetUser() user: UserDto,
    @Body() body: { displayName: string }) {
    return this.userService.modifyName(user, body.displayName);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('modifySocketId')
  modifySocketId(@Body() body: { socketId: string }, @GetUser() user: UserDto) {
    return this.userService.modifySocketId(user, body.socketId);
  }

	@UseGuards(AuthGuard('jwt'))
	@Get('qrcode')
	getQrcode(@GetUser() user: UserDto) {
		return (this.userService.getQrcode(user));
	}

	@Get('get2fa')
	get2fa(@Query() query: {displayName: string}): Promise<string> {
		return (this.userService.get2fa(query.displayName));
	}
}
