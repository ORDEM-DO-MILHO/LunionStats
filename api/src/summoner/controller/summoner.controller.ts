import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SummonerService } from '../services/summoner.service';
// import { data } from './data';
@Controller('summoner')
export class SummonerController {
  constructor(private readonly summonerService: SummonerService) {}

  @Get('/info')
  async getSummonerInfos(@Body() summoner: string) {
    try {
      //data.teams[0].dragonKills
      const result = await this.summonerService.getSummonerInfo(summoner);
      return result;
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  @Get('/history')
  async getSummonerMatches(@Body() summoner: string) {
    const result = await this.summonerService.getSummonerMatchHistory(
      summoner,
      null,
    );

    return result;
  }

  @Get('/league')
  async getSummonerLeague(@Body() summoner: string) {
    const result = await this.summonerService.getSummonerLeague(summoner);
    if (result.message) {
      const code = result.message.split('code')[1];
      throw new HttpException('something_went_wrong', code);
    }
    return result;
  }

  @Get('/masteries')
  async summonerChampMasteries(@Body() summonerId: string) {
    const result = await this.summonerService.summonerChampionMasteries(
      summonerId,
    );
    if (result.message) {
      const code = result.message.split('code')[1];
      throw new HttpException('something_went_wrong', code);
    }
    return result;
  }

  @Get('/match')
  async summonerMatch(@Body() matchId: bigint) {
    try {
      const result = await this.summonerService.getSummonerIndividualMatch(
        matchId,
      );
      return result;
    } catch (error) {
      throw new HttpException('something_went_wrong', error);
    }
  }
}
