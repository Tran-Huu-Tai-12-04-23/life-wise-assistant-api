import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { DiscordController } from './discord.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigService],
  providers: [DiscordService],
  controllers: [DiscordController],
  exports: [DiscordService],
})
export class DiscordModule {}
