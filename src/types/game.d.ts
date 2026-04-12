import type { FlagsDefinitions, IGameFlag, GameFlagId, IActiveFlag } from './flags';
import type { IPlayer } from './player';
import type { IRegion, RegionId } from './region';
import type { ITable } from './table';
import type { ITurnState } from './turn';

export enum AgeId {
  Prolog = 'Prolog',
  Jorney = 'Jorney',
  Epilog = 'Epilog'
}

export type MarkerHistory = Record<AgeId, Record<RegionId, Record<IPlayer['id'], number>>>;

export interface IGameState {
  #players: IPlayer[];
  #currentTurn: ITurnState;
  #currentAge: AgeId;
  #table: ITable;
  #flagDefinitions: FlagsDefinitions;
  #activeFlags: IActiveFlag[];
  #markerHistory: MarkerHistory;
}
