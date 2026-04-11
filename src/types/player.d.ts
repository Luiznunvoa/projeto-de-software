import type { Card } from './card';
import type { RegionId } from './region';
import type { TribeId } from './tribe';

export interface IPlayerStats {
  playerId: number;
  skeletonCount: number;
  // TODO: Pensar em mais estatísticas
}

export interface IPlayer {
  hand: Card[];
  stats: IPlayerStats;
  id: number;
  name: string;
  color: string;
  controlTokens: number;
  markersLeft: number;
}

export interface IBand {
  cards: Card[];
  tribe: TribeId; // raça do bando (todas as cartas devem ser da mesma raça)
  targetRegion: RegionId;
  playerId: number;
  leaderIndex: number; // Index do leader no array de cartas
}
