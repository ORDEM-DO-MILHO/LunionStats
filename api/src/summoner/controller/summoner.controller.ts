import { Body, Controller, Post, HttpException } from '@nestjs/common';
import { SummonerService } from '../services/summoner.service';

@Controller('summoner')
export class SummonerController {
  constructor(private readonly summonerService: SummonerService) {}

  @Post('/info')
  async getSummonerInfos(@Body() summoner: string) {
    try {
      const result = await this.summonerService.getSummonerInfo(summoner);
      return result;
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  @Post('/history')
  async getSummonerMatches(@Body() summoner: string) {
    try {
      const result = await this.summonerService.getSummonerMatchHistory(
        summoner,
        null,
      );
      return result;
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  @Post('/league')
  async getSummonerLeague(@Body() summoner: string) {
    try {
      const result = await this.summonerService.getSummonerLeague(summoner);
      if (result.message) {
        const code = result.message.split('code')[1];
        throw new HttpException('something_went_wrong', code);
      }
      return result;
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  @Post('/masteries')
  async summonerChampMasteries(@Body() summonerId: string) {
    try {
      const result = await this.summonerService.summonerChampionMasteries(
        summonerId,
      );
      if (result.message) {
        const code = result.message.split('code')[1];
        throw new HttpException('something_went_wrong', code);
      }
      return result;
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  // DEV ONLY, DO NOT USE
  @Post('/match')
  async summonerMatch(@Body() matchId: bigint) {
    try {
      const result = await this.summonerService.getSummonerIndividualMatch(
        matchId,
      );
      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
