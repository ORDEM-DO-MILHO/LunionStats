import { HttpModule, Module } from '@nestjs/common';
import { SummonerController } from './controller/summoner.controller';
import { SummonerService } from './services/summoner.service';

@Module({
  imports: [HttpModule],
  providers: [SummonerService],
  controllers: [SummonerController],
  exports: [SummonerService],
})
export class SummonerModule {}
