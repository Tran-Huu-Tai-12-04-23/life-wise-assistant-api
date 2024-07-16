import { Module } from '@nestjs/common';
import { DiscordService } from '../discord/discord.service';
import { WebHookController } from './webhook.controller';
import { WebHookService } from './webhook.service';

@Module({
  imports: [],
  providers: [WebHookService, DiscordService],
  controllers: [WebHookController],
  exports: [WebHookService],
})
export class WebHookModule {}
