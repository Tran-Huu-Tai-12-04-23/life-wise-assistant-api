import { Body, Controller, Get, Post,Redirect,Req, Res, UseGuards } from '@nestjs/common';
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
import { Request, Response } from 'express';

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
  @Get('github')
  async githubAuth(@Req() req: Request, @Res() res: Response) {
    console.log('login with github')
    passport.authenticate('github', { scope: ['user:email'] })(req, res);
  }

  @Post('github/authorized')
  async githubAuthCallback(@Req() req: Request, @Res() res: Response) {
    console.log('User no already')
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

  @Get('google')
  async googleAuth(@Req() req: Request, @Res() res: Response) {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
  }

  @Get('google/callback')
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    passport.authenticate('google', { failureRedirect: '/' }, async (err: Error, user: any) => {
      if (err || !user) {
        return res.redirect('/login?error=auth_failed');
      }
      const signupDTO = await this.service.convertJsonGoogleToSignUpDTO(user);
      if (await this.service.checkUserExist(signupDTO.username)) {
        const signInDto = await this.service.convertSignUpDTOToSignInDTO(signupDTO);
        const loginResponse = await this.service.signIn(signInDto);
        const url = `http://localhost:5173/auth/login?accesstoken=${loginResponse.accessToken}&rftoken=${loginResponse.refreshToken}`;
        return res.redirect(url); // Redirect to frontend URL
      }
      await this.service.signUp(signupDTO);
      const signInDto = await this.service.convertSignUpDTOToSignInDTO(signupDTO);
      const loginResponse = await this.service.signIn(signInDto);
      const url = `http://localhost:5173/auth/login?accesstoken=${loginResponse.accessToken}&rftoken=${loginResponse.refreshToken}`;
      return res.redirect(url); // Redirect to frontend URL
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
