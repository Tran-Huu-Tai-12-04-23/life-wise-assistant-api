import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class TeamPermissionUpdateDTO {
  @ApiProperty({ description: 'Team permission ID' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: 'Is Admin' })
  @IsOptional()
  @IsBoolean()
  isAdmin: boolean;

  @ApiProperty({ description: 'Is Edit' })
  @IsOptional()
  @IsBoolean()
  isEdit: boolean;

  @ApiProperty({ description: 'Is delete' })
  @IsOptional()
  @IsBoolean()
  isDelete: boolean;

  @ApiProperty({ description: 'Is create' })
  @IsOptional()
  @IsBoolean()
  isCreate: boolean;

  @ApiProperty({ description: 'Is assign' })
  @IsOptional()
  @IsBoolean()
  isAssign: boolean;

  @ApiProperty({ description: 'Is inviyte' })
  @IsOptional()
  @IsBoolean()
  isInvite: boolean;
}
export class TeamInviteDTO {
  @ApiProperty({ description: 'Team ID' })
  @IsNotEmpty()
  @IsString()
  teamId: string;

  @ApiProperty({ description: 'Lst User ID' })
  @IsNotEmpty()
  @IsArray()
  lstUserId: string[];
}
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
  @IsOptional()
  @IsArray()
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
