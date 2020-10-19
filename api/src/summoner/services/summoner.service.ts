import { HttpService, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { IMatchIndividual } from '../interfaces/matches-individual.interface';
import { IPlayers } from '../interfaces/players.interface';

dotenv.config();

const defaultAxiosHeaders = { 'X-Riot-Token': process.env.RIOT_API_KEY };

@Injectable()
export class SummonerService {
  constructor(private readonly http: HttpService) {}

  async getSummonerInfo(data: any) {
    try {
      const { data: result } = await this.http
        .get(
          `https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${data.summoner}`,
          {
            headers: defaultAxiosHeaders,
          },
        )
        .toPromise();
      return result;
    } catch (err) {
      return err;
    }
  }

  async getSummonerMatchHistory(summoner: any, index: number) {
    try {
      const defaultMaxIndex = index === null ? 10 : index;
      const { accountId } = await this.getSummonerInfo(summoner);
      const { data } = await this.http
        .get(
          `https://br1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?endIndex=${defaultMaxIndex}`,
          {
            headers: defaultAxiosHeaders,
          },
        )
        .toPromise();

      return await this.formatHistoryList(data);
    } catch (err) {
      return err;
    }
  }

  async getSummonerLeague(summoner: any) {
    try {
      const { id } = await this.getSummonerInfo(summoner);
      const { data: result } = await this.http
        .get(
          `https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}`,
          {
            headers: defaultAxiosHeaders,
          },
        )
        .toPromise();

      return result;
    } catch (err) {
      return err;
    }
  }

  async summonerChampionMasteries(summoner: string) {
    try {
      const { id } = await this.getSummonerInfo(summoner);
      const { data: list } = await this.http
        .get(
          `https://br1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${id}`,
          {
            headers: defaultAxiosHeaders,
          },
        )
        .toPromise();

      const championList = await this.getChampionsList();

      return await list.map(el => ({
        ...el,
        championId: championList.find(ch => ch.key === el.championId)['name'],
      }));
    } catch (err) {
      return err;
    }
  }

  async getSummonerIndividualMatch(body: any) {
    try {
      const { data: match } = await this.http
        .get(`https://br1.api.riotgames.com/lol/match/v4/matches/${body}`, {
          headers: defaultAxiosHeaders,
        })
        .toPromise();

      const queueList = await this.getQueuesList();
      const seasonsList = await this.getSeasonsList();

      const players = await this.formatPlayerInfo(match);

      const gameList: IMatchIndividual = {
        gameId: match.gameId,
        gameCreation: match.gameCreation,
        gameDuration: match.gameDuration,
        queueId: queueList.find(qu => qu.queueId === match.queueId)['map'],
        seasonId: seasonsList.find(se => se.id === match.seasonId)['season'],
        gameMode: match.gameMode,
        gameType: match.gameType,
        players,
      };

      return gameList;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async formatHistoryList(data: any) {
    const queuesList = await this.getQueuesList();
    const seasonsList = await this.getSeasonsList();
    const champList = await this.getChampionsList();
    const match = [];

    // TODO OTIMIZAR (24-30s)
    for (const mat in data.matches) {
      match.push(
        await this.getSummonerIndividualMatch(data.matches[mat]['gameId']),
      );
    }

    return await data.matches.map(el => ({
      ...el,
      champion: champList.find(ch => parseInt(ch.key) === el.champion)['name'],
      queue: queuesList.find(qu => qu.queueId === el.queue)['map'],
      season: seasonsList.find(se => se.id === el.season)['season'],
      match: match.find(mat => mat.gameId === el.gameId),
    }));
  }

  async formatPlayerStats(match: any) {
    const itemsList = await this.getAllItems();
    const stats = [];

    for (const i in match.participants) {
      stats.push({
        participantId: match.participants[i].stats['participantId'],
        items: [
          {
            item0:
              match.participants[i].stats['item0'] !== 0
                ? itemsList.find(
                    item => item.id === match.participants[i].stats['item0'],
                  )
                : null,
            item1:
              match.participants[i].stats['item1'] !== 0
                ? itemsList.find(
                    item => item.id === match.participants[i].stats['item1'],
                  )
                : null,
            item2:
              match.participants[i].stats['item2'] !== 0
                ? itemsList.find(
                    item => item.id === match.participants[i].stats['item2'],
                  )
                : null,
            item3:
              match.participants[i].stats['item3'] !== 0
                ? itemsList.find(
                    item => item.id === match.participants[i].stats['item3'],
                  )
                : null,
            item4:
              match.participants[i].stats['item4'] !== 0
                ? itemsList.find(
                    item => item.id === match.participants[i].stats['item4'],
                  )
                : null,
            item5:
              match.participants[i].stats['item5'] !== 0
                ? itemsList.find(
                    item => item.id === match.participants[i].stats['item5'],
                  )
                : null,
            item6:
              match.participants[i].stats['item6'] !== 0
                ? itemsList.find(
                    item => item.id === match.participants[i].stats['item6'],
                  )
                : null,
          },
        ],
        kills:
          match.participants[i].stats['kills'] === 0
            ? null
            : match.participants[i].stats['kills'],
        deaths:
          match.participants[i].stats['deaths'] === 0
            ? null
            : match.participants[i].stats['deaths'],
        assists:
          match.participants[i].stats['assists'] === 0
            ? null
            : match.participants[i].stats['assists'],
        goldEarned: match.participants[i].stats['goldEarned'],
        champLevel:
          match.participants[i].stats['champLevel'] === 0
            ? null
            : match.participants[i].stats['champLevel'],

        role: match.participants[i].timeline['role'],

        lane: match.participants[i].timeline['lane'],
      });
    }

    return stats;
  }

  async formatPlayerInfo(match: any) {
    const championsList = await this.getChampionsList();
    const spellsList = await this.getSpellsList();
    const participantsIds = await match['participantIdentities'];
    const stats = await this.formatPlayerStats(match);
    const icons = await this.getAllProfilesIcons();

    const players: IPlayers = match.participants.map(el => ({
      participantId: el.participantId,
      summonerName: participantsIds.find(
        part => part.participantId === el.participantId,
      )['player']['summonerName'],
      summonerId: participantsIds.find(
        part => part.participantId === el.participantId,
      )['player']['summonerId'],
      profileIcon: icons.find(
        ic =>
          ic.id ===
          participantsIds.find(part => part.participantId === el.participantId)[
            'player'
          ]['profileIcon'],
      ),
      teamId: el.teamId === 100 ? 'BLUE' : 'RED',
      championId: championsList.find(ch => ch.key === el.championId),
      spell1Id: spellsList.find(sp => sp.key === el.spell1Id),
      spell2Id: spellsList.find(sp => sp.key === el.spell2Id),
      win: el.stats.win,
      stats: stats.find(st => st.participantId === el.participantId),
      role: el.role,
      lane: el.lane,
    }));

    return players;
  }

  async getAllItems() {
    const { data: items } = await this.http
      .get(
        `http://ddragon.leagueoflegends.com/cdn/10.21.1/data/pt_BR/item.json`,
      )
      .toPromise();

    const list = [];
    for (const item in items.data) {
      list.push({
        id: parseInt(item),
        name: items.data[item]['name'],
        image: items.data[item]['image']['full'],
        gold: items.data[item]['gold'],
      });
    }

    return list;
  }

  async getAllProfilesIcons() {
    const { data: icons } = await this.http
      .get(
        `http://ddragon.leagueoflegends.com/cdn/10.21.1/data/pt_BR/profileicon.json`,
      )
      .toPromise();

    const list = [];

    for (const ic in icons.data) {
      list.push({
        id: parseInt(ic),
        image: icons.data[ic]['image']['full'],
      });
    }

    return list;
  }

  async getChampionsList() {
    const { data: champions } = await this.http
      .get(
        `http://ddragon.leagueoflegends.com/cdn/10.21.1/data/pt_BR/champion.json`,
      )
      .toPromise();

    const arr = [];
    for (const champ in champions.data) {
      arr.push({
        name: champions.data[champ]['id'],
        key: parseInt(champions.data[champ]['key']),
        image: champions.data[champ]['image']['full'],
      });
    }

    return arr;
  }

  async getSpellsList() {
    const { data: spells } = await this.http
      .get(
        `http://ddragon.leagueoflegends.com/cdn/10.21.1/data/pt_BR/summoner.json`,
      )
      .toPromise();

    const list = [];
    for (const sp in spells.data) {
      list.push({
        name: spells.data[sp]['name'],
        key: parseInt(spells.data[sp]['key']),
        image: spells.data[sp]['image']['full'],
      });
    }

    return list;
  }

  async getSeasonsList() {
    const { data: list } = await this.http
      .get(`http://static.developer.riotgames.com/docs/lol/seasons.json`)
      .toPromise();

    return list;
  }

  async getQueuesList() {
    const { data: list } = await this.http
      .get(`http://static.developer.riotgames.com/docs/lol/queues.json`)
      .toPromise();

    return list;
  }
}
