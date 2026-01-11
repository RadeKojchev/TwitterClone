// import { Test, TestingModule } from '@nestjs/testing';
// import { PrismaService } from './prisma.service';

// describe('PrismaService', () => {
//   let service: PrismaService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [PrismaService],
//     }).compile();

//     service = module.get<PrismaService>(PrismaService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Ова ја прави Prisma достапна во целиот проект
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Мора да ја експортираме за другите да ја користат
})
export class PrismaModule {}