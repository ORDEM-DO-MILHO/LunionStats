import { IItem } from './item.interface';

export interface IPlayers {
  participantId: number;
  summonerName: string;
  summonerId: string;
  teamId: string;
  championId: string;
  spell1Id: string;
  spell2Id: string;
  stats: any;
  role: string;
  lane: string;
}
