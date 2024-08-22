import { Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

// @ApiTags('Authentication')
@Controller('mail')
export class MailController {
  constructor(private readonly service: MailService) {}
  @Post('send-mail')
  async sendMail() {
    return await this.service.sendMail();
  }
}
