 import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
 import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Наоѓање профил по ID (за /me)
  async getProfileById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: { followers: true, following: true, tweets: true }
        }
      }
    });
  }

  // НОВА ФУНКЦИЈА: Наоѓање профил по Username (за профил страната)
  // backend/src/user/user.service.ts

async getProfileByUsername(username: string, currentUserId?: number) {
  const user = await this.prisma.user.findUnique({
    where: { username },
    include: {
      _count: {
        select: { followers: true, following: true, tweets: true }
      },
      // Проверуваме дали постои запис во табелата follows каде
      // followerId е моето ID, а followingId е ID-то на профилот што го гледам
      followers: currentUserId ? {
        where: { followerId: currentUserId }
      } : false
    }
  });

  if (!user) throw new BadRequestException("Корисникот не е пронајден");

  // Додаваме виртуелно поле isFollowedByMe
  const { followers, ...userData } = user;
  return {
    ...userData,
    isFollowedByMe: followers && followers.length > 0
  };
}
  // async followUser(followerId: number, followingId: number) {
  //   if (followerId === followingId) {
  //     throw new BadRequestException("Не можете да се следите самите себе");
  //   }

  //   const existingFollow = await this.prisma.follows.findUnique({
  //     where: {
  //       followerId_followingId: { followerId, followingId },
  //     },
  //   });

  //   if (existingFollow) {
  //     await this.prisma.follows.delete({
  //       where: {
  //         followerId_followingId: { followerId, followingId },
  //       },
  //     });
  //     return { message: 'Unfollowed' };
  //   }

  //   const follow = await this.prisma.follows.create({
  //     data: { followerId, followingId },
  //   });

  //   await this.prisma.notification.create({
  //     data: {
  //       type: 'FOLLOW',
  //       userId: followingId,
  //       issuerId: followerId,
  //     },
  //   });

  //   return follow;
  // }
  async followUser(followerId: number, followingId: number) {
    // 1. Проверка дали корисникот се обидува да се следи самиот себе
    if (followerId === followingId) {
      throw new BadRequestException("Не можете да се следите самите себе");
    }

    // 2. Проверка дали целниот корисник воопшто постои
    const targetUser = await this.prisma.user.findUnique({
      where: { id: followingId },
    });

    if (!targetUser) {
      throw new NotFoundException("Корисникот што сакате да го следите не е пронајден");
    }

    // 3. Проверка дали веќе постои Follow врска
    const existingFollow = await this.prisma.follows.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });

    if (existingFollow) {
      // Ако постои, тогаш ова е акција за "Unfollow"
      await this.prisma.follows.delete({
        where: {
          followerId_followingId: { followerId, followingId },
        },
      });

      // Опционално: Можеш да ја избришеш и нотификацијата за follow ако сакаш да биде чисто
      await this.prisma.notification.deleteMany({
        where: {
          userId: followingId,
          issuerId: followerId,
          type: 'FOLLOW'
        }
      });

      return { message: 'Unfollowed', isFollowing: false };
    }

    // 4. Креирање на нова Follow врска
    const follow = await this.prisma.follows.create({
      data: { 
        followerId, 
        followingId 
      },
    });

    // 5. КРЕИРАЊЕ НОТИФИКАЦИЈА
    // Ова ќе му се појави на "followingId" во неговиот инбокс
    await this.prisma.notification.create({
      data: {
        type: 'FOLLOW',
        userId: followingId,  // Примач (оној кој доби нов follower)
        issuerId: followerId, // Иницијатор (оној кој кликна follow)
        read: false,          // Почетна состојба
      },
    });

    return { ...follow, isFollowing: true };
  }

  async searchUsers(query: string) {
  return this.prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: query, mode: 'insensitive' } },
        { name: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      username: true,
      name: true,
      profileImage: true,
    },
    take: 5, // Лимитирај на 5 резултати за брзина
  });
}
  async updateProfile(userId: number, data: { bio?: string, location?: string, profileImage?: string, name?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { ...data },
    });
  }
}