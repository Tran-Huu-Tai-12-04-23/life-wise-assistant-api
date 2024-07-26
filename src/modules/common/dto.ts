import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { EHistoryType } from 'src/constants/enum-data';

export class CreateHistoryDTO {
  @ApiProperty({ description: 'content of history' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'type of history' })
  @IsNotEmpty()
  @IsString()
  type: EHistoryType;

  @ApiProperty({ description: 'target action id' })
  @IsNotEmpty()
  @IsString()
  targetActionId: string;
}
