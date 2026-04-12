import type { FlagsDefinitions, IActiveFlag } from '@/types/flags';
import type { AgeId, IGameState, MarkerHistory } from '@/types/game';
import type { IPlayer } from '@/types/player';
import type { ITable } from '@/types/table';
import type { ITurnState } from '@/types/turn';

export class GameState implements IGameState {
  #players: IPlayer[];
  #currentTurn: ITurnState;
  #currentAge: AgeId;
  #table: ITable;
  #flagDefinitions: FlagsDefinitions;
  #activeFlags: IActiveFlag[];
  #markerHistory: MarkerHistory;

  constructor(initialState: IGameState) {
    Object.assign(this, initialState);
  }

  public getState(): IGameState {
    return structuredClone(this);
  }
}
