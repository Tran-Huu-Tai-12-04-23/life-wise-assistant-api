export class BuildLogDTO {
  project: string;
  source: string;
  branch: string;
  employeeName: string;
  commit: string;
  link: string;
  message: string;
  statusName: string;
}

export class TaskLogDTO {
  taskName: string;
  memberName: string;
  link: string;
  statusName: string;
  message: string;
  timeString: string;
}
