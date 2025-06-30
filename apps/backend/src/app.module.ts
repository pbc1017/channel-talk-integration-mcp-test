import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChannelTalkModule } from './channel-talk/channel-talk.module';
import { AppController } from './app.controller';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User],
      synchronize: true, // 개발환경에서만 사용
      logging: true,
    }),
    AuthModule,
    UsersModule,
    ChannelTalkModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
