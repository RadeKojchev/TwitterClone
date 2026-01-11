import { Module } from '@nestjs/common';
import { NotificationsController } from './notification.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [NotificationsController],
  providers: [PrismaService],
})
export class NotificationsModule {}