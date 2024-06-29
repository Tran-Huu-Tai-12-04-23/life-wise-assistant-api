import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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

export class JwtPayloadDTO {
  public username: string;
  public avatar: string;
  public verifyAt: Date;
  public isActive: boolean;
}
