import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { error } from 'console';
@Injectable()
export class MailService {
  constructor(
    public readonly configService: ConfigService,
    private readonly mailService: MailerService,
  ) {}

  TASK_LOG = this.configService.get<string>('TASK_LOG') || '';
  ERROR_LOG = this.configService.get<string>('ERROR_LOG') || '';
  BUILD_LOG = this.configService.get<string>('BUILD_LOG') || '';
  MAIL_USERNAME = this.configService.get<string>('MAIL_USERNAME') || '';

  async sendMail() {
    const message = `Forgot your password? If you didn't forget your password, please ignore this email!`;

    await this.mailService
      .sendMail({
        to: 'huutt201@gmail.com',
        from: this.MAIL_USERNAME,
        subject: `How to Send Emails with Nodemailer`,
        text: message,
        html: '<b>How to Send Emails with Nodemailer</b>',
      })
      .then((res) => {
        console.log(res);
      })
      .catch(() => {
        throw error('Email not sent');
      });

    return {
      message: 'Email sent successfully',
    };
  }
}
