import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class TeamDTO {
  @ApiProperty({ description: 'Team name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Thumbnails of team' })
  @IsNotEmpty()
  @IsString()
  thumbnails: string;

  @ApiProperty({ description: 'Description of team' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Tags of team' })
  @IsOptional()
  @IsString()
  tags: string;
  @ApiProperty({ description: 'Is work place' })
  @IsOptional()
  @IsBoolean()
  isWorkPlace: boolean;
  @ApiProperty({ description: 'List of user IDs' })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  members: string[];
}
export class RemoveUserTeamDTO {
  @ApiProperty({ description: 'Team ID' })
  @IsNotEmpty()
  @IsString()
  id: string;
  @ApiProperty({ description: 'User ID' })
  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class InviteLstMemberDTO {
  @ApiProperty({ description: 'List of user IDs' })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  lstMembers: string[];
}
