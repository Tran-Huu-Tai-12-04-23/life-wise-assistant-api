import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // constructor(private readonly configService: ConfigService) {}
  catch(exception: any, host: ArgumentsHost) {
    console.log(exception?.stack);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const messssss = [];
    const detailMessages = exception?.response?.message || [];
    for (const text of detailMessages) {
      const arrText = text.split('.');
      if (arrText.length == 3 && arrText[0] == 'items') {
        messssss.push(`Dòng ${+arrText[1] + 3} - ${arrText[2]}`);
      } else messssss.push(text);
    }

    //#region log lỗi

    // const jsonRequest = {
    //   body: request.body,
    //   header: request.headers,
    //   ip: request.ip,
    //   user: request.user,
    // }
    // try {
    //   const obj = {
    //     project: this.configService.get<string>('PROJECT') || 'NTSS_SC',
    //     source: this.configService.get<string>('SOURCE') || 'NTSS_SC_API',
    //     environments: this.configService.get<string>('ENVIRONMENT') || 'LOCALHOST',
    //     error: exception,
    //     request: jsonRequest,
    //     message: messssss,
    //     statusCode: status,
    //     timestamp: new Date().toISOString(),
    //     path: request.url,
    //     name: name,
    //   }
    //   const url = this.configService.get<string>('LOG_URL') || `https://ape-bot-api.apetechs.co/bug_log/create_data`
    //   try {
    //     callApiHelper.callAPI(url, obj)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // } catch (error) {
    //   // console.log(error)
    // }

    //#endregion

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      let message: any = exception.message;
      const name = exception.name;

      if (message === 'INTERNAL_SERVER_ERROR' && exception.message) {
        message = exception.message;
      } else if (message.message) {
        message = message.message;
      }

      if (status == HttpStatus.UNAUTHORIZED && message == 'Unauthorized') {
        if (response?.req?.authInfo?.name == 'TokenExpiredError') {
          message = 'Hết phiên đăng nhập, vui lòng đăng nhập lại để tiếp tục.';
        }
      }

      if (
        status == HttpStatus.BAD_REQUEST &&
        name == 'BadRequestException' &&
        message == 'Bad Request Exception'
      ) {
        const detailMessage = messssss.join('<br>+ ') || '';
        message = `Dữ liệu không hợp lệ, chi tiết:<br>+ ${detailMessage}`;
      }

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: message,
        name: name,
      });
    } else {
      const err: any = exception;
      const status = err?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const name = err?.name || err?.statusText || 'INTERNAL_SERVER_ERROR';
      let message =
        err?.message || err?.data?.message || 'INTERNAL_SERVER_ERROR';
      if (message.message) {
        message = message.message;
      }

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: message,
        name: name,
      });
    }
  }
}
