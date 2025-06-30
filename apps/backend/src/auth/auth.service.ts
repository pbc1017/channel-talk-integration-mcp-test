import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { AuthResponse } from '@shared/types/auth';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  // 채널톡 시크릿 키 (실제 환경에서는 환경변수에서 가져와야 함)
  private readonly channelTalkSecretKey =
    process.env.CHANNEL_TALK_SECRET_KEY || '';

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.usersService.validatePassword(
      user,
      password
    );
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(user: User): Promise<AuthResponse> {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken,
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const user = await this.usersService.create(registerDto);
    return this.login(user);
  }

  async generateMemberHash(memberId: string): Promise<{ memberHash: string }> {
    if (!this.channelTalkSecretKey) {
      throw new Error('Channel Talk secret key is not configured');
    }

    try {
      const hash = crypto
        .createHmac('sha256', Buffer.from(this.channelTalkSecretKey, 'hex'))
        .update(memberId)
        .digest('hex');

      return { memberHash: hash };
    } catch (error) {
      throw new Error('Failed to generate member hash');
    }
  }
}
