import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InteractionService {
  constructor(private prisma: PrismaService) {}

  // 1. LIKE ЛОГИКА
  async likeTweet(userId: number, tweetId: number) {
    const existingLike = await this.prisma.like.findUnique({
      where: { userId_tweetId: { userId, tweetId } },
    });

    if (existingLike) {
      await this.prisma.like.delete({ where: { id: existingLike.id } });
      return { message: 'Unliked' };
    }

    const like = await this.prisma.like.create({
      data: { userId, tweetId },
    });

    const tweet = await this.prisma.tweet.findUnique({ where: { id: tweetId } });
    if (tweet && tweet.authorId !== userId) {
      await this.prisma.notification.create({
        data: {
          type: 'LIKE',
          userId: tweet.authorId,
          issuerId: userId,
          tweetId: tweetId,
        },
      });
    }
    return like;
  }

  // 2. RETWEET ЛОГИКА
  async retweetTweet(userId: number, tweetId: number) {
    const originalTweet = await this.prisma.tweet.findUnique({ where: { id: tweetId } });
    if (!originalTweet) throw new NotFoundException('Твитот не постои');

    // Креираме нов твит кој е поврзан со оригиналниот преку retweetId
    const retweet = await this.prisma.tweet.create({
      data: {
        content: originalTweet.content, // Може да биде празно или копија
        authorId: userId,
        retweetId: tweetId,
      },
    });

    // Креирање нотификација
    if (originalTweet.authorId !== userId) {
      await this.prisma.notification.create({
        data: {
          type: 'REPLY', // Можеш да додадеш RETWEET тип во Enum подоцна
          userId: originalTweet.authorId,
          issuerId: userId,
          tweetId: tweetId,
        },
      });
    }

    return retweet;
  }

  // 3. REPLY ЛОГИКА
  async replyToTweet(userId: number, tweetId: number, content: string) {
    const originalTweet = await this.prisma.tweet.findUnique({ where: { id: tweetId } });
    if (!originalTweet) throw new NotFoundException('Твитот не постои');

    // Креираме нов твит кој е поврзан преку parentId
    const reply = await this.prisma.tweet.create({
      data: {
        content,
        authorId: userId,
        parentId: tweetId,
      },
    });

    // Нотификација за авторот на оригиналниот твит
    if (originalTweet.authorId !== userId) {
      await this.prisma.notification.create({
        data: {
          type: 'REPLY',
          userId: originalTweet.authorId,
          issuerId: userId,
          tweetId: tweetId,
        },
      });
    }

    return reply;
  }

  // 4. NOTIFICATIONS
  async getNotifications(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      include: {
        user: {
          select: { username: true, profileImage: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}