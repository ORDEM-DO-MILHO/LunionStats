import { IPlayers } from './players.interface';

export interface IMatchIndividual {
  gameId: bigint;
  gameCreation: Date;
  gameDuration: number;
  queueId: number;
  seasonId: number;
  gameMode: string;
  gameType: string;
  players: IPlayers;
  annotations?: any[];
}
