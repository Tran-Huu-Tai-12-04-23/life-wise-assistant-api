import { Injectable } from '@nestjs/common';
import { BuildLogDTO, TaskLogDTO } from './dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class DiscordService {
  constructor(public readonly configService: ConfigService) {}

  TASK_LOG = this.configService.get<string>('TASK_LOG') || '';
  ERROR_LOG = this.configService.get<string>('ERROR_LOG') || '';
  BUILD_LOG = this.configService.get<string>('BUILD_LOG') || '';

  async buildLog(buildLogDTO: BuildLogDTO) {
    await axios.post(this.BUILD_LOG, {
      embeds: [
        {
          title: 'Notification build log at ' + new Date().toLocaleDateString(),
          fields: [
            { name: 'Project', value: buildLogDTO.project },
            { name: 'Source', value: buildLogDTO.source },
            { name: 'Branch', value: buildLogDTO.branch },
            { name: 'Link', value: buildLogDTO.link },
            { name: 'Message', value: buildLogDTO.message },
            { name: 'Status', value: buildLogDTO.statusName },
          ],
          color: 0x0099ff, // Blue color
        },
      ],
    });
    return '';
  }

  async taskLog(taskLogDTO: TaskLogDTO) {
    await axios.post(this.TASK_LOG, {
      embeds: [
        {
          title: 'Notification task log at ' + new Date().toLocaleString(),
          fields: [
            { name: 'Task name', value: taskLogDTO.taskName },
            { name: 'Member', value: taskLogDTO.memberName },
            { name: 'Status', value: taskLogDTO.statusName },
            { name: 'Time', value: taskLogDTO.timeString },
            { name: 'Message', value: taskLogDTO.message },
          ],
          color: 0x0099ff,
        },
        {
          title: 'Check it!',
          url: taskLogDTO.link,
        },
      ],
    });

    return;
  }
}
