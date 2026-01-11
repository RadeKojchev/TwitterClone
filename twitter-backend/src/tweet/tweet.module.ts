import { Module } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { TweetController } from './tweet.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module'; // Додади го ова

@Module({
  imports: [CloudinaryModule], // Овозможи му на TweetModule да го користи Cloudinary
  controllers: [TweetController],
  providers: [TweetService, PrismaService],
})
export class TweetModule {}