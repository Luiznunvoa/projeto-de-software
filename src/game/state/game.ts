import { TurnPhaseId } from '@/types/turn';

import { Band } from './band';
import { Turn } from './turn';

import type { Player } from './player';
import type { FlagsDefinitions, IActiveFlag } from '@/types/flags';
import type { AgeId, IGameState, MarkerHistory } from '@/types/game';
import type { IBand } from '@/types/player';
import type { RegionsDefinitions } from '@/types/region';
import type { ITable } from '@/types/table';

export class GameState implements IGameState {
  players: Player[];
  currentTurn: Turn;
  currentAge: AgeId;
  table: ITable;
  flagDefinitions: FlagsDefinitions;
  activeFlags: IActiveFlag[];
  markerHistory: MarkerHistory;
  regions: RegionsDefinitions;

  constructor(initialState: IGameState) {
    Object.assign(this, initialState);
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
