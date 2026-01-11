import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service'; // Провери дали овој фајл постои тука

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}