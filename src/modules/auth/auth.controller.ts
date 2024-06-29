import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDTO, SignUpDTO } from './dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @ApiOperation({
    summary: 'Login with username and password',
  })
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDTO) {
    return await this.service.signIn(signInDto);
  }
  @ApiOperation({
    summary: 'Register user with username and password',
  })
  @Post('sign-up')
  async signUp(@Body() signupDTO: SignUpDTO) {
    return await this.service.signUp(signupDTO);
  }

  @ApiOperation({
    summary: 'Refresh ac token when ac token expired',
  })
  @Post('refresh-token')
  async refreshToken(@Body() data: { refreshToken: string }) {
    return await this.service.refreshToken(data);
  }
}
