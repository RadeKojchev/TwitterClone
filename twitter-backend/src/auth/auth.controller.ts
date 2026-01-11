// import { Body, Controller, Post } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { RegisterDto } from './dto/register.dto';

// @Controller('auth')
// export class AuthController {
//   constructor(private authService: AuthService) {}

//   @Post('register')
//   register(@Body() dto: RegisterDto) {
//     return this.authService.register(dto);
//   }
// }
//-----------------------------------------------
// import { Body, Controller, Post } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { RegisterDto } from './dto/register.dto';

// @Controller('auth')
// export class AuthController {
//   constructor(private authService: AuthService) {}

//   @Post('register')
//   register(@Body() dto: RegisterDto) {
//     return this.authService.register(dto);
//   }
// }
// 
//-----------------------------------------------
import { 
  Body, 
  Controller, 
  Post, 
  Get, 
  HttpCode, 
  HttpStatus, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 1. Регистрација на нов корисник
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // 2. Најава (Login) - враќа Access Token
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // 3. Профил на моментално најавениот корисник
  // Оваа рута е заштитена - бара Bearer Token во хедерот
  // @UseGuards(AuthGuard('jwt'))
  // @Get('me')
  // getMe(@Request() req: any) {
  //   // req.user доаѓа од AtStrategy.validate() функцијата
  //   // Тој содржи { sub: userId, email: string }
  //   return req.user;
  // }
  @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getMe(@Request() req: any) {
  return this.authService.getUserById(req.user.sub);
}
}