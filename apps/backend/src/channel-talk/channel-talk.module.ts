import { Module } from '@nestjs/common';
import { ChannelTalkController } from './channel-talk.controller';
import { ChannelTalkService } from './channel-talk.service';

@Module({
  controllers: [ChannelTalkController],
  providers: [ChannelTalkService],
  exports: [ChannelTalkService],
})
export class ChannelTalkModule {}
