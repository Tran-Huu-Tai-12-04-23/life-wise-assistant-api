import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';
import { SignInDTO, SignUpDTO } from './dto';
import { JwtService } from '@nestjs/jwt';

import { JWT_SECRET } from 'src/constants/key';

@Injectable()
export class AuthService {
  constructor(
    private repo: UserRepository,
    private jwtService: JwtService,
  ) {}
  async signIn(signInDto: SignInDTO) {
    const user = await this.repo.findOneBy({ username: signInDto.username });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const isPasswordCorrect = await user.comparePassword(signInDto.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Password incorrect!');
    }

    const payload = {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      isActive: user.isActive,
      verifyAt: user.verifyAt,
    };
    const accessToken = this.jwtService.sign(payload);

    const refreshPayload = {
      id: user.id,
    };
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
  async signUp(signUpDTO: SignUpDTO) {
    if (await this.repo.findOneBy({ username: signUpDTO.username })) {
      throw new UnauthorizedException('User already exists!');
    }

    if (signUpDTO.password !== signUpDTO.confirmPassword) {
      throw new UnauthorizedException('Password not match!');
    }

    return await this.repo.save({
      username: signUpDTO.username,
      password: signUpDTO.password,
      avatar:
        'https://cdn3d.iconscout.com/3d/premium/thumb/man-avatar-6299539-5187871.png?f=webp',
      isActive: true,
      verifyAt: new Date(),
    });
  }

  async refreshToken(data: { refreshToken: string }) {
    const { id } = this.jwtService.verify(data.refreshToken, {
      secret: JWT_SECRET,
    });
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new UnauthorizedException('User not found!');

    const refreshPayload = {
      id: user.id,
    };
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: '7d',
    });

    return { refreshToken };
  }
}
