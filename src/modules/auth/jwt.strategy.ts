import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../../repositories';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    public readonly configService: ConfigService,
    private readonly userRepo: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { uid: string }) {
    const user: any = await this.userRepo.findOne({
      where: { id: payload.uid },
      relations: {
        userDetail: true,
      },
    });
    if (!user) throw new UnauthorizedException('No permission!');

    const detail = user.__userDetail__;
    delete user.__userDetail__;
    delete user.password;
    return {
      ...user,
      userDetail: detail,
    };
  }
}
