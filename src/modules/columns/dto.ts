import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
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
  lstPersonInCharge: string[];

  @ApiProperty({ description: 'Search key' })
  @IsOptional()
  @IsString()
  searchKey: string;

  @ApiProperty({ description: 'Status name' })
  @IsOptional()
  @IsString()
  status: string;
}
