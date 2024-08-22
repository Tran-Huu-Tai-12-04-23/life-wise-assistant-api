import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { enumData } from 'src/constants/enum-data';
import { UserEntity } from 'src/entities';
import { CurrentUser } from 'src/helpers/decorators';
import { PaginationDTO } from '../dto';
import { passport } from './auth.passport';
import { AuthService } from './auth.service';
import {
  FilterLstUserToInviteTeamDTO,
  RefreshTokenDTO,
  SignInDTO,
  SignUpDTO,
} from './dto';
import { JwtAuthGuard } from './jwt.auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly configService: ConfigService,
  ) {}
  private FRONT_END_LINK = this.configService.get<string>('FRONT_END_LINK');

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
    console.log('login with github');
    passport.authenticate('github', { scope: ['user:email'] })(req, res);
  }

  @Get('github/authorized')
  async githubAuthCallback(@Req() req: Request, @Res() res: Response) {
    passport.authenticate(
      'github',
      { failureRedirect: '/' },
      async (err: Error, user: any) => {
        if (err || !user) {
          return res.status(404).json({ error: 'Authentication failed' });
        }

        const signupDTO = await this.service.convertJsonGitHubToSignUpDTO(user);

        if (await this.service.checkUserExist(signupDTO.username)) {
          const signInDto =
            await this.service.convertSignUpDTOToSignInDTO(signupDTO);
          const loginResponse = await this.service.signIn(signInDto);

          const url = `${this.FRONT_END_LINK}/auth/github/callback/success?accessToken=${loginResponse.accessToken}`;
          return res.redirect(url);
        }

        // If the user does not exist, sign them up
        await this.service.signUp(signupDTO);

        // Convert the sign-up DTO to sign-in DTO and log the user in
        const signInDto =
          await this.service.convertSignUpDTOToSignInDTO(signupDTO);
        const loginResponse = await this.service.signIn(signInDto);

        // Redirect to the frontend with the access token
        const url = `${this.FRONT_END_LINK}/auth/github/callback/success?accessToken=${loginResponse.accessToken}`;
        return res.redirect(url);
      },
    )(req, res);
  }

  @Get('google')
  async googleAuth(@Req() req: Request, @Res() res: Response) {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })(req, res);
  }

  @Get('google/callback')
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    passport.authenticate(
      'google',
      { failureRedirect: '/' },
      async (err: Error, user: any) => {
        if (err || !user) {
          return res.redirect('/login?error=auth_failed');
        }
        const signupDTO = await this.service.convertJsonGoogleToSignUpDTO(user);
        if (await this.service.checkUserExist(signupDTO.username)) {
          const signInDto =
            await this.service.convertSignUpDTOToSignInDTO(signupDTO);
          const loginResponse = await this.service.signIn(signInDto);

          const url = `${this.FRONT_END_LINK}/auth/google/callback/success?accessToken=${loginResponse.accessToken}`;
          return res.redirect(url);
        }
        await this.service.signUp(signupDTO);
        const signInDto =
          await this.service.convertSignUpDTOToSignInDTO(signupDTO);
        const loginResponse = await this.service.signIn(signInDto);
        const url = `${this.FRONT_END_LINK}/auth/google/callback/success?accessToken=${loginResponse.accessToken}`;
        return res.redirect(url);
      },
    )(req, res);
  }

  @Get('facebook')
  async facebookAuth(@Req() req: Request, @Res() res: Response) {
    passport.authenticate('facebook', {
      scope: ['public_profile', 'email'],
    })(req, res);
  }

  @Get('facebook/callback')
  async facebookAuthCallback(@Req() req: Request, @Res() res: Response) {
    passport.authenticate(
      'facebook',
      { failureRedirect: '/' },
      async (err: Error, user: any) => {
        if (err || !user) {
          return res.redirect('/login?error=auth_failed');
        }
        const signupDTO =
          await this.service.convertJsonFacebookToSignUpDTO(user);
        if (await this.service.checkUserExist(signupDTO.username)) {
          const signInDto =
            await this.service.convertSignUpDTOToSignInDTO(signupDTO);
          const loginResponse = await this.service.signIn(signInDto);

          const url = `${this.FRONT_END_LINK}/auth/facebook/callback/success?accessToken=${loginResponse.accessToken}`;
          return res.redirect(url);
        }
        await this.service.signUp(signupDTO);
        const signInDto =
          await this.service.convertSignUpDTOToSignInDTO(signupDTO);
        const loginResponse = await this.service.signIn(signInDto);
        const url = `${this.FRONT_END_LINK}/auth/facebook/callback/success?accessToken=${loginResponse.accessToken}`;
        return res.redirect(url);
      },
    )(req, res);
  }

  @ApiOperation({
    summary: 'Refresh ac token when ac token expired',
  })
  @Post('refresh-token')
  async refreshToken(@Body() data: RefreshTokenDTO) {
    return await this.service.refreshToken(data);
  }
}
