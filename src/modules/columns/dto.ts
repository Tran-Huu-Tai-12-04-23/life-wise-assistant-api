import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ColumnDTO {
  @ApiProperty({ description: 'Column name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Team id' })
  @IsNotEmpty()
  @IsString()
  teamId: string;

  @ApiProperty({ description: 'Column status code' })
  @IsNotEmpty()
  @IsString()
  statusCode: string;
  @ApiProperty({ description: 'Index of column' })
  @IsOptional()
  @IsNumber()
  index: number;
}

export class SwapColDTO {
  @ApiProperty({ description: 'Column current index' })
  @IsNotEmpty()
  @IsNumber()
  colCurrentIndex: number;
  @ApiProperty({ description: 'Column target index' })
  @IsNotEmpty()
  @IsNumber()
  colTargetIndex: number;
}

export class GetAllColumnsDTO {
  @ApiProperty({ description: 'Team id' })
  @IsNotEmpty()
  @IsString()
  teamId: string;

  @ApiProperty({ description: 'Lst member in charge' })
  @IsOptional()
  @IsArray()
  members: string[];

  @ApiProperty({ description: 'Search key' })
  @IsOptional()
  @IsString()
  searchKey: string;

  @ApiProperty({ description: 'Status name' })
  @IsOptional()
  @IsArray()
  lstStatus: string;
}

export class GetDataToFilterDTO {
  @ApiProperty({ description: 'Team id' })
  @IsNotEmpty()
  @IsString()
  teamId: string;
}
