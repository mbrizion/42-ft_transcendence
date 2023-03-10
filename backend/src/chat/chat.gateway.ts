
import { ForbiddenException, Injectable } from "@nestjs/common";
import { OnModuleInit } from '@nestjs/common';
import { MessageBody, ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ChannelService } from "./interfaces/channel.service";
import { Body, Controller, Delete, Get, Post, UseGuards, Req, Query } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


//@Injectable()
@WebSocketGateway(4343, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  }
})
export class ChatGateway implements OnModuleInit {
  constructor(private chatService: ChatService,
    private channelService: ChannelService) { }

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      //send all the messages for the user
      console.log('A new client runs connection with socket ', socket.id);
    })
  }

  @SubscribeMessage('setConnection')
  onSetConnection(
    @ConnectedSocket() socket: any,
    @MessageBody() userId: number) {
    console.log('A new client runs setConnection with socket ', socket.id, ' and id ', userId);
    return (this.chatService.setConnection(Number(userId), socket.id));
  }

  @OnEvent('flushAllChannels')
  async flushAllChannels() {
    let channelInterfaces = await this.channelService.getChannelInterfaces();

    for (let channelInterface of channelInterfaces) {
      this.server.to(channelInterface.userSocketId).emit('channelInterface', channelInterface)
    }
  }
}
