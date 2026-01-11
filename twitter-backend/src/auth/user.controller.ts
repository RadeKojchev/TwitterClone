import { 
  Controller, 
  Post, 
  Patch, 
  Get, 
  Body, 
  Param, 
  UseGuards, 
  Request, 
  ParseIntPipe, 
  UseInterceptors, 
  UploadedFiles,
  Query 
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MediaService } from '../media/media.service';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private mediaService: MediaService 
  ) {}

  // 1. Земање податоци за тековниот најавен корисник
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Request() req: any) {
    return this.userService.getProfileById(Number(req.user.sub));
  }

  // 2. Следење/Одследување корисник
  @UseGuards(AuthGuard('jwt'))
  @Post('follow/:id')
  follow(@Param('id', ParseIntPipe) followingId: number, @Request() req: any) {
    const userId = Number(req.user.sub);
    return this.userService.followUser(userId, followingId);
  }

  // 3. Јавен профил преку username - СЕГА СО JWT ПРОВЕРКА
  @UseGuards(AuthGuard('jwt')) 
  @Get('profile/:username')
  async getByUsername(
    @Param('username') username: string,
    @Request() req: any
  ) {
    // Бидејќи користиме Guard, req.user.sub дефинитивно ќе постои ако токенот е валиден
    const currentUserId = req.user?.sub ? Number(req.user.sub) : undefined;
    
    return this.userService.getProfileByUsername(username, currentUserId);
  }

  // 4. АЖУРИРАЊЕ НА ПРОФИЛ
  @UseGuards(AuthGuard('jwt'))
  @Patch('profile')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]))
  async updateProfile(
    @Request() req: any,
    @Body() body: any,
    @UploadedFiles() files: { profileImage?: Express.Multer.File[], coverImage?: Express.Multer.File[] }
  ) {
    const userId = Number(req.user.sub);
    const updateData: any = { ...body };

    // Проверка и качување на профилна слика
    if (files?.profileImage && files.profileImage.length > 0) {
      const upload = await this.mediaService.uploadImage(files.profileImage[0]);
      updateData.profileImage = upload.secure_url;
    }

    // Проверка и качување на насловна (cover) слика
    if (files?.coverImage && files.coverImage.length > 0) {
      const upload = await this.mediaService.uploadImage(files.coverImage[0]);
      updateData.coverImage = upload.secure_url;
    }

    // Чистење на можни празни полиња од body
    if (updateData.name === '') delete updateData.name;
    
    return this.userService.updateProfile(userId, updateData);
  }
  @Get('search')
async search(@Query('q') query: string) {
  if (!query) return [];
  return this.userService.searchUsers(query);
}
}