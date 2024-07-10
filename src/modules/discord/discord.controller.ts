import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscordService } from './discord.service';

@ApiTags('Authentication')
@Controller('discord')
export class DiscordController {
  constructor(private readonly service: DiscordService) {}
}
