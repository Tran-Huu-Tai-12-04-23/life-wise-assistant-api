import { Module } from '@nestjs/common';
import { databaseProvider } from './databae-provider';
@Module({
  imports: [],
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
