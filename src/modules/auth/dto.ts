import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FilterLstUserToInviteTeamDTO {
  @ApiProperty({ description: 'List user id' })
  @IsOptional()
  @IsString()
  lstUserTeamExist: string[];

  @ApiProperty({ description: 'Name of user' })
  @IsOptional()
  @IsString()
  name: string;
}
export class SignInDTO {
  @ApiProperty({ description: 'Username' })
  @IsNotEmpty()
  @IsString()
  username: string;
  @ApiProperty({ description: 'Password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SignUpDTO {
  @ApiProperty({ description: 'Username' })
  @IsNotEmpty()
  @IsString()
  username: string;
  @ApiProperty({ description: 'Password' })
  @IsNotEmpty()
  @IsString()
  password: string;
  @ApiProperty({ description: 'Confirm password' })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}
export class RefreshTokenDTO {
  @ApiProperty({ description: 'refreshToken to get new access token' })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export class JwtPayloadDTO {
  public username: string;
  public avatar: string;
  public verifyAt: Date;
  public isActive: boolean;
}

export class UserDataDTO {
  id: string;
  username: string;
  password: string;
  avatar: string;
  verifyAt: Date;
  isActive: boolean;
  role: string;
  userDetail: UserDetailDTO;
  createdAt: Date;
  createdBy: string;
  createdByName: string;
  updatedAt: Date;
  updatedBy: string;
  deleteBy: string;
  isDeleted: boolean;
}

export class UserDetailDTO {
  fullName: string;
  address: string;
  phoneNumber: string;
  email: string;
  githubLink: string;
  telegramLink: string;
  facebookLink: string;
  bio: string;
}
