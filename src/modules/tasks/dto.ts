import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

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
  dateToComplete: Date;

  @ApiProperty({ description: 'Task priority' })
  @IsNotEmpty()
  @IsString()
  priority: string;

  @ApiProperty({ description: 'Task type' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ description: 'Lst person in charge' })
  @IsNotEmpty()
  @IsString()
  lstPersonInCharge: string[];

  @ApiProperty({ description: 'File document in link' })
  @IsNotEmpty()
  @IsString()
  fileLink: string[];

  @ApiProperty({ description: 'Link source code' })
  @IsOptional()
  @IsString()
  sourceCodeLink: string[];

  @ApiProperty({ description: 'Column id' })
  @IsNotEmpty()
  @IsString()
  columnId: string;
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
