import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray } from 'class-validator';

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
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Tags of team' })
  @IsNotEmpty()
  @IsString()
  tags: string;

  @ApiProperty({ description: 'List of user IDs' })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  users: string[];
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
