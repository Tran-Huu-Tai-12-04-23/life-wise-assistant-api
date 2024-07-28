import { enumData } from 'src/constants/enum-data';

class CoreHelper {
  public newDateTZ() {
    const d = new Date();
    const offset = 7;
    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;

    // create new Date object for different city
    // using supplied offset
    const nd = new Date(utc + 3600000 * offset);
    return nd;
  }

  public getStatusOfTask(status: string) {
    const statusOb = enumData.taskStatus.hasOwnProperty(status)
      ? enumData.taskStatus[status as 'PENDING']
      : null;

    return statusOb;
  }

  public getPriorityOfTask(pr: string) {
    const priority = enumData.taskPriority.hasOwnProperty(pr)
      ? enumData.taskPriority[pr as 'HIGH']
      : null;

    return priority;
  }

  public getTypeOfTask(ty: string) {
    const taskType = enumData.taskType.hasOwnProperty(ty)
      ? enumData.taskType[ty as 'BUG']
      : null;

    return taskType;
  }
}

export const coreHelper = new CoreHelper();
