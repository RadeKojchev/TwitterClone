// import { Module } from '@nestjs/common';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';

// @Module({
//   controllers: [AuthController],
//   providers: [AuthService]
// })
// export class AuthModule {}
//---------------------------------------------
// import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { PrismaModule } from '../prisma/prisma.module';

// @Module({
//   imports: [PrismaModule], // Додај го PrismaModule тука
//   controllers: [AuthController],
//   providers: [AuthService],
// })
// export class AuthModule {}
//---------------------------------------------

// import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { PrismaModule } from '../prisma/prisma.module';
// import { JwtModule } from '@nestjs/jwt';

// @Module({
//   imports: [
//     PrismaModule,
//     // Го конфигурираме JWT модулот
//     JwtModule.register({
//       global: true, // Го прави достапен во целиот проект
//       secret: 'super-secret-key-123', // Ова е клучот со кој се потпишува токенот
//       signOptions: { expiresIn: '1d' }, // Токенот ќе биде валиден 24 часа
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService],
// })
// export class AuthModule {}
//---------------------------------------------
// import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { PrismaModule } from '../prisma/prisma.module';
// import { JwtModule } from '@nestjs/jwt';
// import { AtStrategy } from './at.strategy'; // Ова е новиот импорт

// @Module({
//   imports: [
//     PrismaModule,
//     JwtModule.register({
//       global: true,
//       secret: 'super-secret-key-123',
//       signOptions: { expiresIn: '1d' },
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [
//     AuthService, 
//     AtStrategy // Го додаваме AtStrategy како провајдер
//   ],
// })
// export class AuthModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from './user.service'; // Нов сервис
import { AuthController } from './auth.controller';
import { UserController } from './user.controller'; // Нов контролер
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy } from './at.strategy';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [
    PrismaModule,
    MediaModule,
    JwtModule.register({
      global: true,
      secret: 'super-secret-key-123',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController, UserController], // Го додаваме UserController
  providers: [
    AuthService, 
    UserService, // Го додаваме UserService
    AtStrategy
  ],
  exports: [UserService], // Го експортираме за секој случај
})
export class AuthModule {}