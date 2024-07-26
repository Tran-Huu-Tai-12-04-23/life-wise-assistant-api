import { Body, Controller, Get, Post,Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  FilterLstUserToInviteTeamDTO,
  RefreshTokenDTO,
  SignInDTO,
  SignUpDTO,
} from './dto';
import { UserEntity } from 'src/entities';
import { CurrentUser } from 'src/helpers/decorators';
import { JwtAuthGuard } from './jwt.auth.guard';
import { PaginationDTO } from '../dto';
import { enumData } from 'src/constants/enum-data';
import { passport, secretKey } from './auth.passport';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @ApiOperation({
    summary: 'Get lst user to invite team',
  })
  @Post('lst-user-to-invite-team')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getLstUserFilter(
    @CurrentUser() user: UserEntity,
    @Body() filter: PaginationDTO<FilterLstUserToInviteTeamDTO>,
  ) {
    return await this.service.getLstUserToInviteTeam(user, filter);
  }

  @ApiOperation({
    summary: 'Get profile of user',
  })
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getProfile(@CurrentUser() user: UserEntity) {
    return {
      user,
      enumData: enumData,
    };
  }

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
    summary: 'Login with github',
  })
  @Post('github')
  async githubAuth(@Req() req: Request, @Res() res: Response) {
    passport.authenticate('github', { scope: ['user:email'] })(req, res);
  }

  @Get('github/authorized')
  async githubAuthCallback(@Req() req: Request, @Res() res: Response) {
    passport.authenticate('github', { failureRedirect: '/' }, async (err: Error, user: any) => {
      if (err || !user) {
        return { status: 404};
      }
      const signupDTO = await this.service.convertJsonGitHubToSignUpDTO(user);
      // If the user exists, then login
      if(await this.service.checkUserExist(signupDTO.username)){
        const signInDto = await this.service.convertSignUpDTOToSignInDTO(signupDTO);
        return await this.service.signIn(signInDto);
      }
      // Else sign up
      return await this.service.signUp(signupDTO);
    })(req, res);
  }

  @Post('google')
  async googleAuth(@Req() req: Request, @Res() res: Response) {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
  }

  @Get('google/callback')
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    passport.authenticate('google', { failureRedirect: '/' }, async (err: Error, user: any) => {
      if (err || !user) {
        return { status: 404};
      }
      const signupDTO = await this.service.convertJsonGoogleToSignUpDTO(user);
      // If the user exists, then login
      if(await this.service.checkUserExist(signupDTO.username)){
        const signInDto = await this.service.convertSignUpDTOToSignInDTO(signupDTO);
        return await this.service.signIn(signInDto);
      }
      // Else sign up
      return await this.service.signUp(signupDTO);
    })(req, res);
  }

  @ApiOperation({
    summary: 'Refresh ac token when ac token expired',
  })
  @Post('refresh-token')
  async refreshToken(@Body() data: RefreshTokenDTO) {
    return await this.service.refreshToken(data);
  }
}
