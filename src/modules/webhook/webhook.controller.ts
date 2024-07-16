import { Controller, Headers, Post, Req } from '@nestjs/common';
import { WebHookService } from './webhook.service';

@Controller('webhook')
export class WebHookController {
  constructor(private readonly service: WebHookService) {}
  @Post('github-hook')
  public async githubBuildStatusWebHook(
    @Req() req: Request,
    @Headers() headers: any,
  ) {
    return await this.service.githubHook(req, headers);
  }
}
