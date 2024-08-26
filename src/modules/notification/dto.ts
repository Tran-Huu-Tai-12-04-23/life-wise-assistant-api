import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NotificationToCreateDTO {
  @ApiProperty({ description: 'notify title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'notify sub title' })
  @IsNotEmpty()
  @IsString()
  subTitle: string;

  @ApiProperty({ description: 'description of notify' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ description: 'type of notify' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ description: 'linkTarget of notify' })
  @IsNotEmpty()
  @IsString()
  linkTarget: string;

  @ApiProperty({ description: 'user ID' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ description: 'username to create' })
  @IsNotEmpty()
  @IsString()
  createdByName: string;

  @ApiProperty({ description: 'user ID to create' })
  @IsNotEmpty()
  @IsString()
  createdBy: string;
}

export class NotificationTeamInviteToCreateDTO extends NotificationToCreateDTO {
  @ApiProperty({ description: 'team invited id' })
  @IsNotEmpty()
  @IsString()
  teamInviteId: string;
}
