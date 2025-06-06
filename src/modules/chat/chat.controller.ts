import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/entities';
import { CurrentUser } from 'src/helpers/decorators';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { PaginationDTO } from '../dto';
import { ChatService } from './chat.service';
import {
  CreateChatDTO,
  CreateGroupChatDTO,
  FilterGroupData,
  MessagePaginationDTO,
} from './dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('chat module')
@Controller('chat')
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @ApiOperation({
    summary: 'Create new group chat with multi user',
  })
  @Post('create-group-chat')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createNewGroupChat(
    @CurrentUser() user: UserEntity,
    @Body() createGroupChatDTO: CreateGroupChatDTO,
  ) {
    return await this.service.createNewGroupChatMultiMember(
      user,
      createGroupChatDTO,
    );
  }

  @ApiOperation({
    summary: 'Create new chat with user',
  })
  @Post('create-new-chat')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createNewChat(
    @CurrentUser() user: UserEntity,
    @Body() createChatDTO: CreateChatDTO,
  ) {
    return await this.service.createNewChat(user, createChatDTO);
  }

  @ApiOperation({
    summary: 'Get lst group chat',
  })
  @Post('group-chat-pagination')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getLstGroupChatPagination(
    @CurrentUser() user: UserEntity,
    @Body() body: PaginationDTO<FilterGroupData>,
  ) {
    return await this.service.groupChatPagination(user, body);
  }

  @ApiOperation({
    summary: 'Message pagination',
  })
  @Post('message-pagination')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async messagePagination(
    @CurrentUser() user: UserEntity,
    @Body() body: PaginationDTO<MessagePaginationDTO>,
  ) {
    return await this.service.messagePagination(user, body);
  }
}
