// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { NotificationType } from '@prisma/client';

// @Injectable()
// export class TweetService {
//   constructor(private prisma: PrismaService) {}

//   // ПРИВАТНА ПОМОШНА ФУНКЦИЈА ЗА КРЕИРАЊЕ НОТИФИКАЦИИ
//   private async createNotification(userId: number, issuerId: number, type: NotificationType, tweetId?: number) {
//     // Не праќај нотификација ако корисникот прави акција на сопствен твит
//     if (userId === issuerId) return;

//     return this.prisma.notification.create({
//       data: {
//         userId,     // Кој ја прима
//         issuerId,   // Кој ја предизвика (пр. кој лајкна)
//         type,       // LIKE, REPLY, FOLLOW...
//         tweetId,    // Поврзан твит
//       },
//     });
//   }

//   async createTweet(userId: number, content: string, imageUrl?: string, parentId?: number) {
//     const tweet = await this.prisma.tweet.create({
//       data: {
//         content,
//         image: imageUrl,
//         authorId: userId,
//         parentId: parentId ? Number(parentId) : null,
//       },
//       include: {
//         author: true,
//         likes: true,
//         _count: { select: { likes: true, retweets: true, replies: true } }
//       },
//     });

//     // АКО Е ОДГОВОР (REPLY), КРЕИРАЈ НОТИФИКАЦИЈА ЗА АВТОРОТ НА ОРИГИНАЛОТ
//     if (parentId) {
//       const parentTweet = await this.prisma.tweet.findUnique({
//         where: { id: Number(parentId) }
//       });
//       if (parentTweet) {
//         await this.createNotification(parentTweet.authorId, userId, 'REPLY', parentTweet.id);
//       }
//     }

//     return tweet;
//   }

//   async getAllTweets() {
//     return this.prisma.tweet.findMany({
//       orderBy: { createdAt: 'desc' },
//       include: {
//         author: true,
//         likes: true,
//         retweet: { include: { author: true } },
//         _count: { select: { likes: true, retweets: true, replies: true } },
//       },
//     });
//   }

//   async getHomeFeed(userId: number, page: number = 1, limit: number = 10) {
//     const skip = (page - 1) * limit;
//     const followingEntries = await this.prisma.follows.findMany({
//       where: { followerId: userId },
//       select: { followingId: true }
//     });

//     const followingIds = followingEntries.map(f => f.followingId);
//     followingIds.push(userId);

//     return this.prisma.tweet.findMany({
//       where: { authorId: { in: followingIds }, parentId: null },
//       include: {
//         author: true,
//         likes: true,
//         retweet: { include: { author: true } },
//         _count: { select: { likes: true, retweets: true, replies: true } }
//       },
//       orderBy: { createdAt: 'desc' },
//       take: limit,
//       skip: skip,
//     });
//   }

//   async toggleLike(userId: number, tweetId: number) {
//     const existingLike = await this.prisma.like.findUnique({
//       where: { userId_tweetId: { userId, tweetId } },
//     });

//     const tweet = await this.prisma.tweet.findUnique({ where: { id: tweetId } });
//     if (!tweet) throw new NotFoundException('Твитот не постои');

//     if (existingLike) {
//       await this.prisma.like.delete({ where: { id: existingLike.id } });
//       return { liked: false };
//     } else {
//       await this.prisma.like.create({ data: { userId, tweetId } });
      
//       // КРЕИРАЈ НОТИФИКАЦИЈА ЗА LIKE
//       await this.createNotification(tweet.authorId, userId, 'LIKE', tweetId);
      
//       return { liked: true };
//     }
//   }

//   async createRetweet(userId: number, tweetId: number) {
//     const existingRetweet = await this.prisma.tweet.findFirst({
//       where: { authorId: userId, retweetId: tweetId },
//     });

//     const originalTweet = await this.prisma.tweet.findUnique({ where: { id: tweetId } });
//     if (!originalTweet) throw new NotFoundException('Оригиналниот твит не е најден');

//     if (existingRetweet) {
//       await this.prisma.tweet.delete({ where: { id: existingRetweet.id } });
//       return { retweeted: false };
//     }

//     const retweet = await this.prisma.tweet.create({
//       data: {
//         authorId: userId,
//         retweetId: tweetId,
//         content: '', 
//       },
//     });

//     // КРЕИРАЈ НОТИФИКАЦИЈА ЗА RETWEET (Додај RETWEET во enum-от во Prisma ако веќе го немаш)
//     // Ако Prisma јавува грешка за 'RETWEET', користи 'LIKE' или 'REPLY' додека не направиш миграција
//     await this.createNotification(originalTweet.authorId, userId, 'REPLY', tweetId);

//     return { retweeted: true, retweet };
//   }

//   async getTweetWithReplies(tweetId: number) {
//     const tweet = await this.prisma.tweet.findUnique({
//       where: { id: tweetId },
//       include: {
//         author: true,
//         likes: true,
//         retweet: { include: { author: true } },
//         _count: { select: { likes: true, retweets: true, replies: true } },
//       },
//     });

//     if (!tweet) throw new NotFoundException('Твитот не е најден');

//     const replies = await this.prisma.tweet.findMany({
//       where: { parentId: tweetId },
//       include: {
//         author: true,
//         likes: true,
//         _count: { select: { likes: true, retweets: true, replies: true } },
//       },
//       orderBy: { createdAt: 'asc' },
//     });

//     return { tweet, replies };
//   }

//   async getTweetsByUsername(username: string) {
//     return this.prisma.tweet.findMany({
//       where: { author: { username } },
//       include: {
//         author: true,
//         likes: true,
//         retweet: { include: { author: true } },
//         _count: { select: { likes: true, retweets: true, replies: true } }
//       },
//       orderBy: { createdAt: 'desc' },
//     });
//   }
// }

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class TweetService {
  constructor(private prisma: PrismaService) {}

  private async createNotification(userId: number, issuerId: number, type: NotificationType, tweetId?: number) {
    if (userId === issuerId) return;
    return this.prisma.notification.create({
      data: { userId, issuerId, type, tweetId },
    });
  }

  async createTweet(userId: number, content: string, imageUrl?: string, parentId?: number) {
    const tweet = await this.prisma.tweet.create({
      data: {
        content,
        image: imageUrl,
        authorId: userId,
        parentId: parentId ? Number(parentId) : null,
      },
      include: {
        author: true,
        likes: true,
        _count: { select: { likes: true, retweets: true, replies: true } }
      },
    });

    if (parentId) {
      const parentTweet = await this.prisma.tweet.findUnique({
        where: { id: Number(parentId) }
      });
      if (parentTweet) {
        await this.createNotification(parentTweet.authorId, userId, 'REPLY', parentTweet.id);
      }
    }
    return tweet;
  }

  async getAllTweets() {
    return this.prisma.tweet.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        likes: true,
        retweet: { include: { author: true } },
        _count: { select: { likes: true, retweets: true, replies: true } },
      },
    });
  }

  async getHomeFeed(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const followingEntries = await this.prisma.follows.findMany({
      where: { followerId: userId },
      select: { followingId: true }
    });

    const followingIds = followingEntries.map(f => f.followingId);
    followingIds.push(userId);

    return this.prisma.tweet.findMany({
      where: { authorId: { in: followingIds }, parentId: null },
      include: {
        author: true,
        likes: true,
        retweet: { include: { author: true } },
        _count: { select: { likes: true, retweets: true, replies: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: skip,
    });
  }

  async toggleLike(userId: number, tweetId: number) {
    const existingLike = await this.prisma.like.findUnique({
      where: { userId_tweetId: { userId, tweetId } },
    });
    const tweet = await this.prisma.tweet.findUnique({ where: { id: tweetId } });
    if (!tweet) throw new NotFoundException('Твитот не постои');

    if (existingLike) {
      await this.prisma.like.delete({ where: { id: existingLike.id } });
      return { liked: false };
    } else {
      await this.prisma.like.create({ data: { userId, tweetId } });
      await this.createNotification(tweet.authorId, userId, 'LIKE', tweetId);
      return { liked: true };
    }
  }

  async createRetweet(userId: number, tweetId: number) {
    const existingRetweet = await this.prisma.tweet.findFirst({
      where: { authorId: userId, retweetId: tweetId },
    });
    const originalTweet = await this.prisma.tweet.findUnique({ where: { id: tweetId } });
    if (!originalTweet) throw new NotFoundException('Оригиналниот твит не е најден');

    if (existingRetweet) {
      await this.prisma.tweet.delete({ where: { id: existingRetweet.id } });
      return { retweeted: false };
    }

    const retweet = await this.prisma.tweet.create({
      data: { authorId: userId, retweetId: tweetId, content: '' },
    });
    await this.createNotification(originalTweet.authorId, userId, 'REPLY', tweetId);
    return { retweeted: true, retweet };
  }

  async getTweetWithReplies(tweetId: number) {
    const tweet = await this.prisma.tweet.findUnique({
      where: { id: tweetId },
      include: {
        author: true,
        likes: true,
        retweet: { include: { author: true } },
        _count: { select: { likes: true, retweets: true, replies: true } },
      },
    });
    if (!tweet) throw new NotFoundException('Твитот не е најден');
    const replies = await this.prisma.tweet.findMany({
      where: { parentId: tweetId },
      include: {
        author: true,
        likes: true,
        _count: { select: { likes: true, retweets: true, replies: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    return { tweet, replies };
  }

  async getTweetsByUsername(username: string) {
    return this.prisma.tweet.findMany({
      where: { author: { username } },
      include: {
        author: true,
        likes: true,
        retweet: { include: { author: true } },
        _count: { select: { likes: true, retweets: true, replies: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // НОВА ФУНКЦИЈА ЗА БРИШЕЊЕ
  async deleteTweet(userId: number, tweetId: number) {
    const tweet = await this.prisma.tweet.findUnique({
      where: { id: tweetId },
    });

    if (!tweet) throw new NotFoundException('Твитот не е пронајден');
    if (tweet.authorId !== userId) {
      throw new ForbiddenException('Немате дозвола да го избришете овој твит');
    }

    return this.prisma.tweet.delete({
      where: { id: tweetId },
    });
  }
}