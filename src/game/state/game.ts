import { TurnPhaseId } from '@/types/turn';

import { Band } from './band';
import { Table } from './table';
import { Turn } from './turn';

import type { Player } from './player';
import type { ICard } from '@/types/card';
import type { FlagsDefinitions, IActiveFlag } from '@/types/flags';
import type { AgeId, IGameState, MarkerHistory } from '@/types/game';
import type { IBand } from '@/types/player';
import type { RegionsDefinitions } from '@/types/region';

export interface IGameConfig {
  playerCount: number;
  cards: ICard[];
  flagDefinitions: FlagsDefinitions;
  regions: RegionsDefinitions;
}

export class GameState implements IGameState {
  players: Player[];
  currentTurn: Turn;
  currentAge: AgeId;
  table: Table;
  flagDefinitions: FlagsDefinitions;
  activeFlags: IActiveFlag[];
  markerHistory: MarkerHistory;
  regions: RegionsDefinitions;

  constructor(config: IGameConfig) {
    this.table = new Table(config.cards);
  }

  public getState(): IGameState {
    return structuredClone(this);
  }

  private createBand(band: Omit<IBand, 'tribe'>): IBand {
    return new Band(band);
  }

  public newTurn(): void {
    const old = this.currentTurn;

    this.currentTurn = new Turn({
      playerId: (old.playerId + 1) % this.players.length,
      phase: TurnPhaseId.ChooseAction
    });
  }
}
