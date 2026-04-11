import type { Card } from "./card";
import type { TribeId } from "./tribe";
import type { RegionId  } from "./region";

export interface PlayerStats {
  playerId: number
  skeletonCount: number
  // TODO: Pensar em mais estatísticas 
}

export interface Player {
  hand: Card[];
  stats: PlayerStats
  id: number; 
  name: string;
  color: string;

  controlTokens: number;
  markersLeft: number;
}


export interface Band {
  cards: Card[];
  tribe: TribeId;  // raça do bando (todas as cartas devem ser da mesma raça)
  targetRegion: RegionId;
  playerId: number;
  leaderIndex: number; // Index do leader no array de cartas
}

