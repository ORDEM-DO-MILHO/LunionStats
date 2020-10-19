import { Body, Controller, Get, HttpException } from '@nestjs/common';
import { SummonerService } from '../services/summoner.service';

@Controller('summoner')
export class SummonerController {
  constructor(private readonly summonerService: SummonerService) {}

  @Get('/info')
  async getSummonerInfos(@Body() summoner: string) {
    const result = await this.summonerService.getSummonerInfo(summoner);
    if (result.message) {
      const code = result.message.split('code')[1];
      throw new HttpException('something_went_wrong', code);
    }
    return result;
  }

  @Get('/history')
  async getSummonerMatches(@Body() summoner: string) {
    const result = await this.summonerService.getSummonerMatchHistory(
      summoner,
      null,
    );
    if (result.message) {
      const code = result.message.split('code')[1];
      throw new HttpException('something_went_wrong', code);
    }
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
    const result = await this.summonerService.getSummonerIndividualMatch(
      matchId,
    );
    if (result.message) {
      const code = result.message.split('code')[1];
      throw new HttpException('something_went_wrong', code);
    }
    return result;
  }
}
