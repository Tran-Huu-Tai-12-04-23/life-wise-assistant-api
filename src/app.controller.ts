import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('')
@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @ApiOperation({ summary: 'Kiểm tra tình trạng server' })
  @ApiResponse({ status: 200, description: 'Trả về tình trạng server' })
  @Get('healthcheck')
  healthCheck() {
    return this.service.healthCheck();
  }

  @ApiOperation({ summary: 'Kiểm tra thời gian theo timezone của server' })
  @ApiResponse({ status: 200, description: 'Giờ server & giờ ở múi giờ 9' })
  @Get('timezone')
  checkTimeZone() {
    return this.service.checkTimeZone();
  }

  @ApiOperation({ summary: 'Kiểm tra timeout của server' })
  @Get('timeout')
  async checkTimeOut() {
    return await this.service.delay(10 * 60 * 1000);
  }
}
