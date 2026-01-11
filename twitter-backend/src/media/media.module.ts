import { Module } from '@nestjs/common';
import { MediaService } from './media.service';

@Module({
  providers: [MediaService],
  exports: [MediaService], // Многу важно: за да можат другите да го користат
})
export class MediaModule {}