import { HttpModule, Module } from '@nestjs/common';
import { AnnotationModule } from 'src/annotation/annotation.module';
import { SummonerController } from './controller/summoner.controller';
import { SummonerService } from './services/summoner.service';

@Module({
  imports: [HttpModule, AnnotationModule],
  providers: [SummonerService],
  controllers: [SummonerController],
  exports: [SummonerService],
})
export class SummonerModule {}
