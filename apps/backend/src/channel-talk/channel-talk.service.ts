import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class ChannelTalkService {
  private readonly logger = new Logger(ChannelTalkService.name);

  constructor(private configService: ConfigService) {}

  /**
   * 멤버 해시 생성
   * @param memberId 사용자 ID
   * @returns HMAC-SHA256 해시 값
   */
  generateMemberHash(memberId: string): string {
    const secretKey = this.configService.get<string>('CHANNEL_TALK_SECRET_KEY');

    if (!secretKey) {
      this.logger.error('CHANNEL_TALK_SECRET_KEY is not configured');
      throw new Error('Channel Talk secret key is not configured');
    }

    try {
      const hash = crypto
        .createHmac('sha256', Buffer.from(secretKey, 'hex'))
        .update(memberId)
        .digest('hex');

      this.logger.debug(`Generated member hash for memberId: ${memberId}`);
      return hash;
    } catch (error) {
      this.logger.error(`Failed to generate member hash: ${error.message}`);
      throw new Error('Failed to generate member hash');
    }
  }

  /**
   * 시크릿 키 유효성 검증
   * @returns boolean
   */
  validateSecretKey(): boolean {
    const secretKey = this.configService.get<string>('CHANNEL_TALK_SECRET_KEY');

    if (!secretKey) {
      return false;
    }

    // 시크릿 키는 64자리 hex 문자열이어야 함
    const hexRegex = /^[0-9a-f]{64}$/i;
    return hexRegex.test(secretKey);
  }
}
