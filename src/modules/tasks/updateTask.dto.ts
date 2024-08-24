import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SubTaskDTO, TaskFileDTO } from './dto';

export class UpdateTaskDTO {
  @ApiProperty({ description: 'Task id' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: 'Task title' })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Task status' })
  @IsOptional()
  @IsString()
  status: string;

  @ApiProperty({ description: 'Task description' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Member assign lst id ' })
  @IsOptional()
  @IsArray()
  members: string[];

  @ApiProperty({ description: 'Type of task' })
  @IsOptional()
  @IsString()
  type: string;

  @ApiProperty({ description: 'Priority of task' })
  @IsOptional()
  @IsString()
  priority: string;

  @ApiProperty({ description: 'Date expire ' })
  @IsOptional()
  expireDate: Date;
}

export class AddSubTaskDTO {
  @ApiProperty({ description: 'Task id' })
  @IsNotEmpty()
  @IsString()
  taskId: string;

  @ApiProperty({ description: 'Data subtask ' })
  @IsNotEmpty()
  data: SubTaskDTO;
}

export class AddTaskFileDTO {
  @ApiProperty({ description: 'Task id' })
  @IsNotEmpty()
  @IsString()
  taskId: string;

  @ApiProperty({ description: 'Data file ' })
  @IsNotEmpty()
  data: TaskFileDTO;
}

export class AddTaskCommentDTO {
  @ApiProperty({ description: 'Task id' })
  @IsNotEmpty()
  @IsString()
  taskId: string;

  @ApiProperty({ description: 'Comment content' })
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class EditTaskCommentDTO {
  @ApiProperty({ description: 'Task id' })
  @IsNotEmpty()
  @IsString()
  taskId: string;

  @ApiProperty({ description: 'Comment id' })
  @IsNotEmpty()
  @IsString()
  commentId: string;

  @ApiProperty({ description: 'Comment content' })
  @IsNotEmpty()
  @IsString()
  content: string;
}
