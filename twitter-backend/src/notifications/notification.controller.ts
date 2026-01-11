import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('notifications')
export class NotificationsController {
  constructor(private prisma: PrismaService) {}

  // 1. Земање на сите нотификации со податоци за иницијаторот и твитот
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getNotifications(@Request() req: any) {
    return this.prisma.notification.findMany({
      where: { userId: Number(req.user.sub) },
      include: {
        issuer: {
          select: {
            username: true,
            name: true,
            profileImage: true,
          },
        },
        tweet: {
          select: {
            id: true,
            content: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 2. Бројач за непрочитани нотификации (за Sidebar-от)
  @UseGuards(AuthGuard('jwt'))
  @Get('unread-count')
  async getUnreadCount(@Request() req: any) {
    const count = await this.prisma.notification.count({
      where: {
        userId: Number(req.user.sub),
        read: false,
      },
    });
    return { count };
  }

  // 3. Означување на сите како прочитани
  @UseGuards(AuthGuard('jwt'))
  @Post('read-all')
  async markAsRead(@Request() req: any) {
    await this.prisma.notification.updateMany({
      where: {
        userId: Number(req.user.sub),
        read: false,
      },
      data: { read: true },
    });
    return { success: true };
  }
}