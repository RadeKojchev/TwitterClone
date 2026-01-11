// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class AuthService {}
//---------------------------------------------

// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { RegisterDto } from './dto/register.dto';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class AuthService {
//   constructor(private prisma: PrismaService) {}

//   async register(dto: RegisterDto) {
//     // 1. Криптирање на лозинката
//     const hashedPassword = await bcrypt.hash(dto.password, 10);

//     // 2. Зачувување во база преку Prisma
//     const user = await this.prisma.user.create({
//       data: {
//         email: dto.email,
//         username: dto.username,
//         name: dto.name,
//         password: hashedPassword,
//       },
//     });

//     // 3. Враќање на корисникот (без лозинката заради безбедност)
//     const { password, ...result } = user;
//     return result;
//   }
// }

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto'; // Ќе го креираме овој DTO следно
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // Го додаваме jwtService во конструкторот
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        name: dto.name,
        password: hashedPassword,
      },
    });

    const { password, ...result } = user;
    return result;
  }

  async login(dto: LoginDto) {
    // 1. Проверка дали корисникот постои
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Погрешен емаил или лозинка');
    }

    // 2. Споредба на внесената лозинка со таа во базата (криптираната)
    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Погрешен емаил или лозинка');
    }

    // 3. Генерирање на JWT токен ако се е во ред
    const payload = { sub: user.id, email: user.email };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name
      }
    };
  }
  async getUserById(id: number) {
  return this.prisma.user.findUnique({
    where: { id },
    select: { name: true, username: true, profileImage: true } // Не го праќаме пасвордот!
  });
}
}