// import { 
//   Controller, 
//   Post, 
//   Get, 
//   Param, 
//   UseGuards, 
//   Request, 
//   ParseIntPipe 
// } from '@nestjs/common';
// import { InteractionService } from './interaction.service';
// import { AuthGuard } from '@nestjs/passport';

// @Controller('interactions')
// export class InteractionController {
//   constructor(private interactionService: InteractionService) {}

//   // Лајкување на твит (Toggle: ако е лајкнат - го одлајкнува)
//   @UseGuards(AuthGuard('jwt'))
//   @Post('like/:id')
//   like(@Param('id', ParseIntPipe) tweetId: number, @Request() req: any) {
//     const userId = req.user.sub;
//     return this.interactionService.likeTweet(userId, tweetId);
//   }

//   // Преземање на сите нотификации за најавениот корисник
//   @UseGuards(AuthGuard('jwt'))
//   @Get('notifications')
//   getNotifications(@Request() req: any) {
//     const userId = req.user.sub;
//     return this.interactionService.getNotifications(userId);
//   }
// }

import { 
  Controller, 
  Post, 
  Get, 
  Param, 
  UseGuards, 
  Request, 
  ParseIntPipe,
  Body // Додади го ова
} from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('interactions')
export class InteractionController {
  constructor(private interactionService: InteractionService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('like/:id')
  like(@Param('id', ParseIntPipe) tweetId: number, @Request() req: any) {
    const userId = req.user.sub;
    return this.interactionService.likeTweet(userId, tweetId);
  }

  // НОВО: Рута за Retweet
  @UseGuards(AuthGuard('jwt'))
  @Post('retweet/:id')
  retweet(@Param('id', ParseIntPipe) tweetId: number, @Request() req: any) {
    const userId = req.user.sub;
    return this.interactionService.retweetTweet(userId, tweetId);
  }

  // НОВО: Рута за Reply
  @UseGuards(AuthGuard('jwt'))
  @Post('reply/:id')
  reply(
    @Param('id', ParseIntPipe) tweetId: number, 
    @Request() req: any,
    @Body('content') content: string // Бекендот го очекува "content" од фронтендот
  ) {
    const userId = req.user.sub;
    return this.interactionService.replyToTweet(userId, tweetId, content);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('notifications')
  getNotifications(@Request() req: any) {
    const userId = req.user.sub;
    return this.interactionService.getNotifications(userId);
  }
}