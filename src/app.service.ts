import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * @param message
   * @returns hehe
   */

  getHello(): string {
    return 'Hello World!';
  }
}
