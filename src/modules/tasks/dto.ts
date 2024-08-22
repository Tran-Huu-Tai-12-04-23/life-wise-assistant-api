import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDTO } from '../dto';

export class TaskDTO {
  @ApiProperty({ description: 'Task title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Task description' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Date to complete ' })
  @IsNotEmpty()
  @IsString()
  expireDate: Date;

  @ApiProperty({ description: 'Task priority' })
  @IsNotEmpty()
  @IsString()
  priority: string;

  @ApiProperty({ description: 'Task type' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ description: 'Lst person in charge' })
  @IsOptional()
  @IsArray()
  lstPersonInCharge: string[];

  @ApiProperty({ description: 'Link source code' })
  @IsOptional()
  @IsString()
  sourceCodeLink: string;

  @ApiProperty({ description: 'Column id' })
  @IsNotEmpty()
  @IsString()
  columnId: string;

  @ApiProperty({ description: 'Comments of task ' })
  @IsOptional()
  @IsArray()
  comments: CommentDTO[];

  @ApiProperty({ description: 'SubTasks of task ' })
  @IsOptional()
  @IsArray()
  subTasks: SubTaskDTO[];

  @ApiProperty({ description: 'File link of task ' })
  @IsOptional()
  @IsArray()
  taskFile: TaskFileDTO[];
}

export class TaskFileDTO {
  @ApiProperty({ description: 'File document in link' })
  @IsNotEmpty()
  @IsString()
  fileLink: string;

  @ApiProperty({ description: 'Name of link' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class SubTaskDTO {
  @ApiProperty({ description: 'SubTask name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Is done ' })
  @IsNotEmpty()
  @IsBoolean()
  isChecked: boolean;
}

export class CommentDTO {
  @ApiProperty({ description: 'Comment content' })
  @IsNotEmpty()
  @IsString()
  content: string;
  @ApiProperty({ description: 'Owner of comment' })
  @IsOptional()
  @IsString()
  ownerId: string;
}
export class ChangeStatusTaskDTO {
  @ApiProperty({ description: 'Task id' })
  @IsNotEmpty()
  @IsString()
  taskId: string;

  @ApiProperty({ description: 'Task status' })
  @IsNotEmpty()
  @IsString()
  status: string;
}

export class MoveTaskInTheSameColumnDTO {
  @ApiProperty({ description: 'Column id' })
  @IsNotEmpty()
  @IsString()
  columnId: string;

  @ApiProperty({ description: 'Task current index' })
  @IsNotEmpty()
  @IsNumber()
  taskCurrentIndex: number;
  @ApiProperty({ description: 'Task new index' })
  @IsNotEmpty()
  @IsNumber()
  taskNewIndex: number;
}

export class MoveTaskInAnotherColumnDTO {
  @ApiProperty({ description: 'Task current index' })
  @IsNotEmpty()
  @IsNumber()
  taskCurrentIndex: number;
  @ApiProperty({ description: 'Task new index' })
  @IsNotEmpty()
  @IsNumber()
  taskNewIndex: number;
  @ApiProperty({ description: 'Column from id' })
  @IsNotEmpty()
  @IsString()
  columnIdFrom: string;

  @ApiProperty({ description: 'Column from id' })
  @IsNotEmpty()
  @IsString()
  columnIdTo: string;
}

export class TaskPaginationDTO extends PaginationDTO {
  @ApiProperty({ description: 'Task status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Team id' })
  @IsOptional()
  @IsString()
  teamId?: string;

  @ApiProperty({ description: 'Column id' })
  @IsOptional()
  @IsString()
  columnId?: string;

  @ApiProperty({ description: 'User id' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ description: 'User id' })
  @IsOptional()
  @IsString()
  teamMemberId?: string;

  @ApiProperty({ description: 'User id' })
  @IsOptional()
  @IsString()
  search?: string;
}
