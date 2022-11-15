import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controllers';
import { ChatService } from './chat.service';

@Module({
  controllers: [ChatController],
	providers: [ChatGateway, ChatService],
})
export class ChatModule {}