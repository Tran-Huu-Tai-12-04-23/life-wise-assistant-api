import { Injectable } from '@nestjs/common';
import { coreHelper } from './helpers';

@Injectable()
export class AppService {
  /** check status of server */
  healthCheck() {
    return 'This server is healthy. - update v1 at 23:127PM deploy CI/CD';
  }

  /** check time by timezone of server */
  checkTimeZone() {
    const newDate = new Date();
    const newDateTz = coreHelper.newDateTZ();

    return `newDate: ${newDate}\nnewDateTZ+7: ${newDateTz}`;
  }

  /** waiting for 30min */
  delay(ms = 1800000) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Đợi chờ là hạnh phúc.');
      }, ms);
    });
  }
}
