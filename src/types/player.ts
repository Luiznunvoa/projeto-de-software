import type { IAlly } from './card';
import type { RegionId } from './region';
import type { TribeId } from './tribe';

export interface IPlayerStats {
  playerId: number;
  skeletonCount: number;
  // TODO: Pensar em mais estatísticas
}

export interface IPlayer {
  readonly id: number;
  readonly color: string;
  readonly name: string;
  hand: IAlly[];
  controlTokens: number;
  markersLeft: number;
  stats: IPlayerStats;
}

export interface IBand {
  cards: IAlly[];
  tribe: TribeId; // raça do bando (todas as cartas devem ser da mesma raça)
  targetRegion: RegionId;
  playerId: number;
  leaderIndex: number; // Index do leader no array de cartas
}
