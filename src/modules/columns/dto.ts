import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ColumnDTO {
  @ApiProperty({ description: 'Column name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Team id' })
  @IsNotEmpty()
  @IsString()
  teamId: string;
}
