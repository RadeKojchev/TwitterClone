import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Оваа функција се извршува кога серверот се пали
  async onModuleInit() {
    await this.$connect();
  }

  // Оваа функција се извршува кога серверот се гаси (за да не остане отворена врска)
  async onModuleDestroy() {
    await this.$disconnect();
  }
}