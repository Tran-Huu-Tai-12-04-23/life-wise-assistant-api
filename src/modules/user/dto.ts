import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty({ description: 'Full name of user' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Address of user' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: 'Phone number of user' })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({ description: 'Email of user' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ description: 'Github link of user' })
  @IsNotEmpty()
  @IsString()
  githubLink: string;

  @ApiProperty({ description: 'Telegram link of user' })
  @IsNotEmpty()
  @IsString()
  telegramLink: string;

  @ApiProperty({ description: 'Facebook link of user' })
  @IsNotEmpty()
  @IsString()
  facebookLink: string;

  @ApiProperty({ description: 'Bio of user' })
  @IsNotEmpty()
  @IsString()
  bio: string;

  @ApiProperty({ description: 'Avatar' })
  @IsOptional()
  @IsString()
  avatar: string;
}
