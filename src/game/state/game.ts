import { Band } from './band';

import type { Player } from './player';
import type { FlagsDefinitions, IActiveFlag } from '@/types/flags';
import type { AgeId, IGameState, MarkerHistory } from '@/types/game';
import type { IBand } from '@/types/player';
import type { ITable } from '@/types/table';
import type { ITurnState } from '@/types/turn';

export class GameState implements IGameState {
  players: Player[];
  currentTurn: ITurnState;
  currentAge: AgeId;
  table: ITable;
  flagDefinitions: FlagsDefinitions;
  activeFlags: IActiveFlag[];
  markerHistory: MarkerHistory;

  constructor(initialState: IGameState) {
    Object.assign(this, initialState);
  }

  public getState(): IGameState {
    return structuredClone(this);
  }

  private createBand(band: Omit<IBand, 'tribe'>): IBand {
    // Garante que a tribo do bando será a mesma que a tribo do líder 
    return new Band({ ...band, tribe: band.cards[band.leaderIndex].tribe });
  }
}
