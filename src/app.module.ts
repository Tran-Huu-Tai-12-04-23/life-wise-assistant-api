import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { TeamModule } from './modules/teams/team.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, TeamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
