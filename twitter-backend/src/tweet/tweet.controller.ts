// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   UseGuards,
//   Request,
//   Param,
//   ParseIntPipe,
//   UseInterceptors,
//   UploadedFile,
//   Query,
// } from '@nestjs/common';
// import { TweetService } from './tweet.service';
// import { AuthGuard } from '@nestjs/passport';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { CloudinaryService } from '../cloudinary/cloudinary.service';

// @Controller('tweets')
// export class TweetController {
//   constructor(
//     private readonly tweetService: TweetService,
//     private readonly cloudinaryService: CloudinaryService,
//   ) {}

//   @UseGuards(AuthGuard('jwt'))
//   @Post()
//   @UseInterceptors(FileInterceptor('image'))
//   async create(
//     @Body('content') content: string,
//     @Body('parentId') parentId: string,
//     @Request() req: any,
//     @UploadedFile() file: Express.Multer.File,
//   ) {
//     let imageUrl = undefined;
//     if (file) {
//       const upload = await this.cloudinaryService.uploadFile(file);
//       imageUrl = upload.secure_url;
//     }
//     return this.tweetService.createTweet(
//       Number(req.user.sub), 
//       content, 
//       imageUrl, 
//       parentId ? Number(parentId) : undefined
//     );
//   }

//   @Get()
//   findAll() {
//     return this.tweetService.getAllTweets();
//   }

//   @UseGuards(AuthGuard('jwt'))
//   @Get('feed')
//   async getFeed(
//     @Request() req: any,
//     @Query('page') page: string,
//     @Query('limit') limit: string
//   ) {
//     const p = page ? parseInt(page) : 1;
//     const l = limit ? parseInt(limit) : 10;
//     return this.tweetService.getHomeFeed(Number(req.user.sub), p, l);
//   }

//   @Get(':id/details')
//   async getDetails(@Param('id', ParseIntPipe) id: number) {
//     return this.tweetService.getTweetWithReplies(id);
//   }

//   @Get('user/:username')
//   async getTweetsByUser(@Param('username') username: string) {
//     return this.tweetService.getTweetsByUsername(username);
//   }

//   @UseGuards(AuthGuard('jwt'))
//   @Post(':id/like')
//   async toggleLike(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
//     return this.tweetService.toggleLike(Number(req.user.sub), id);
//   }

//   @UseGuards(AuthGuard('jwt'))
//   @Post(':id/retweet')
//   async retweet(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
//     // Осигурај се дека имаш createRetweet во tweet.service.ts
//     return this.tweetService.createRetweet(Number(req.user.sub), id);
//   }
// }

import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UseGuards,
  Request,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { TweetService } from './tweet.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('tweets')
export class TweetController {
  constructor(
    private readonly tweetService: TweetService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body('content') content: string,
    @Body('parentId') parentId: string,
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let imageUrl = undefined;
    if (file) {
      const upload = await this.cloudinaryService.uploadFile(file);
      imageUrl = upload.secure_url;
    }
    return this.tweetService.createTweet(
      Number(req.user.sub), 
      content, 
      imageUrl, 
      parentId ? Number(parentId) : undefined
    );
  }

  @Get()
  findAll() {
    return this.tweetService.getAllTweets();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('feed')
  async getFeed(
    @Request() req: any,
    @Query('page') page: string,
    @Query('limit') limit: string
  ) {
    const p = page ? parseInt(page) : 1;
    const l = limit ? parseInt(limit) : 10;
    return this.tweetService.getHomeFeed(Number(req.user.sub), p, l);
  }

  @Get(':id/details')
  async getDetails(@Param('id', ParseIntPipe) id: number) {
    return this.tweetService.getTweetWithReplies(id);
  }

  @Get('user/:username')
  async getTweetsByUser(@Param('username') username: string) {
    return this.tweetService.getTweetsByUsername(username);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/like')
  async toggleLike(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.tweetService.toggleLike(Number(req.user.sub), id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/retweet')
  async retweet(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.tweetService.createRetweet(Number(req.user.sub), id);
  }

  // НОВА РУТА ЗА БРИШЕЊЕ
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.tweetService.deleteTweet(Number(req.user.sub), id);
  }
}