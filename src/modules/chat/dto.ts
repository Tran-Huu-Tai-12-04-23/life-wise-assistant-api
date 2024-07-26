import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupChatDTO {
  @ApiProperty({ description: 'Group name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'List of user IDs' })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  members: string[];
}

export class CreateChatDTO {
  @ApiProperty({ description: 'User id target' })
  @IsNotEmpty()
  @IsString()
  userTargetId: string;
}
