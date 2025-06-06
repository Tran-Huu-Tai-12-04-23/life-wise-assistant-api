import { BadRequestException, Headers, Injectable, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { DiscordService } from '../discord/discord.service';
import { BuildLogDTO } from '../discord/dto';
@Injectable()
export class WebHookService {
  secret = '';
  constructor(
    private readonly configService: ConfigService,
    private readonly discordService: DiscordService,
  ) {
    this.secret =
      this.configService.get<string>('GITHUB_WEBHOOKS_TOKEN') ||
      'GITHUB_WEBHOOKS_TOKEN';
  }

  verifySignature(payload: any, secret: string, signature: string) {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(
      'sha256=' + hmac.update(JSON.stringify(payload)).digest('hex'),
      'utf8',
    );
    const checksum = Buffer.from(signature, 'utf8');
    return crypto.timingSafeEqual(digest, checksum);
  }

  public async githubHook(@Req() req: Request, @Headers() headers: any) {
    const payload: any = req.body;
    // const secret = process.env.WEBHOOK_SECRET // Your webhook secret here
    const signature = headers['x-hub-signature-256'];

    if (!this.verifySignature(payload, this.secret, signature)) {
      console.error('Invalid signature');
      throw new BadRequestException('Invalid signature');
    }
    let event = '';
    // Check if the webhook event is one of the events we're interested in
    const allowedEvents = ['workflow_job']; //, 'pull_request', 'push'] //,'workflow_run', 'workflow_job']
    if (!allowedEvents.includes(headers['x-github-event'] as string)) {
      // console.log(`Unsupported event type: ${headers['x-github-event']}`)
      return { success: false };
    }
    event = headers['x-github-event'] as string;

    //#region xử lý data
    const deloyStatus = payload[event].status;

    const creator = payload.sender.login;
    // const description = payload.deployment_status.description;
    const wfdisplay_title = payload[event].display_title;
    const wfname = payload[event].name;
    const repository = payload.repository.name;
    const source = payload.repository.url;
    const branch = payload[event].head_branch;
    let stringNoti = `Dự án: ${repository}
              Nhân viên: ${creator}
              Nhánh: ${branch}
              Commit: ${wfdisplay_title}`;

    const stringStatus = `Tiến trình ${wfname} - ${deloyStatus}`;
    stringNoti = `${stringNoti} - ${stringStatus}`;

    const buildLogDTO = new BuildLogDTO();
    buildLogDTO.branch = branch;
    buildLogDTO.link = source;
    buildLogDTO.message = stringNoti;
    buildLogDTO.project = repository;
    buildLogDTO.source = source;
    buildLogDTO.statusName = stringStatus;
    buildLogDTO.employeeName = creator;

    await this.discordService.buildLog(buildLogDTO);

    //#endregion

    // Handle the webhook payload here
    // console.log(`Received webhook payload: ${JSON.stringify(payload)}`)
    return { success: 'Build log success' };
  }
}
