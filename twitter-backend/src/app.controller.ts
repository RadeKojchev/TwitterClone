// import { Controller, Get } from '@nestjs/common';
// import { AppService } from './app.service';

// @Controller()
// export class AppController {
//   constructor(private readonly appService: AppService) {}

//   @Get()
//   getHello(): string {
//     return this.appService.getHello();
//   }
// }
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  // Тука се случува Dependency Injection преку constructor-от
  constructor(private readonly prisma: PrismaService) {}

  @Get('test-db')
  async testDatabase() {
    // Проверуваме дали можеме да пристапиме до табелата 'user'
    const userCount = await this.prisma.user.count();
    return {
      message: 'Dependency Injection работи успешно!',
      databaseConnected: true,
      currentUsers: userCount,
    };
  }
}