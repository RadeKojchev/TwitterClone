// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config'; // Додади го овој импорт
// import { TweetModule } from './tweet/tweet.module';
// import { AuthModule } from './auth/auth.module';
// import { PrismaModule } from './prisma/prisma.module';
// import { CloudinaryModule } from './cloudinary/cloudinary.module';

// @Module({
//   imports: [
//     // Ова овозможува читање на .env фајлот во целиот проект
//     ConfigModule.forRoot({
//       isGlobal: true, 
//     }),
//     TweetModule,
//     AuthModule,
//     PrismaModule,
//     CloudinaryModule,
//   ],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { TweetModule } from './tweet/tweet.module';
import { PrismaModule } from './prisma/prisma.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { InteractionModule } from './tweet/interaction.module'; // 1. ДОДАЈ ГО ОВОЈ ИМПОРТ
import { NotificationsModule } from './notifications/notifications.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    AuthModule, 
    TweetModule, 
    PrismaModule, 
    CloudinaryModule,
    NotificationsModule,
    InteractionModule, 
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}