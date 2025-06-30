import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChannelTalkService } from './channel-talk.service';
import {
  MemberHashRequestDto,
  MemberHashResponseDto,
} from './dto/member-hash.dto';

@Controller('channel-talk')
export class ChannelTalkController {
  constructor(private readonly channelTalkService: ChannelTalkService) {}

  /**
   * 멤버 해시 생성 API
   * 인증된 사용자만 접근 가능
   */
  @Post('member-hash')
  @UseGuards(JwtAuthGuard)
  async generateMemberHash(
    @Body() memberHashRequestDto: MemberHashRequestDto
  ): Promise<MemberHashResponseDto> {
    try {
      const memberHash = this.channelTalkService.generateMemberHash(
        memberHashRequestDto.memberId
      );

      return { memberHash };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to generate member hash',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 채널톡 시크릿 키 유효성 검증 API
   * 개발/디버깅 목적 (인증 필요)
   */
  @Get('validate-config')
  @UseGuards(JwtAuthGuard)
  async validateConfig(): Promise<{ isValid: boolean; message: string }> {
    const isValid = this.channelTalkService.validateSecretKey();

    return {
      isValid,
      message: isValid
        ? 'Channel Talk secret key is properly configured'
        : 'Channel Talk secret key is missing or invalid',
    };
  }
}
