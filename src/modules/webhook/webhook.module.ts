import { Module } from '@nestjs/common';
import { DiscordService } from '../discord/discord.service';
import { WebHookController } from './webhook.controller';
import { WebHookService } from './webhook.service';

@Module({
  imports: [DiscordService],
  providers: [WebHookService],
  controllers: [WebHookController],
  exports: [WebHookService],
})
export class WebHookModule {}
