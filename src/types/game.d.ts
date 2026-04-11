import type { Dragon, Card, Ally } from './card';
import type { FlagsDefinitions, IGameFlag, GameFlagId, IActiveFlag } from './flags';
import type { IPlayer } from './player';
import type { IRegion, RegionId, RegionsDefinitions } from './region';
import type { ITurnState } from './turn';

export enum AgeId {
  Prolog = 'Prolog',
  Jorney = 'Jorney',
  Epilog = 'Epilog'
}

export type MarkerHistory = Record<AgeId, Record<RegionId, Record<IPlayer['id'], number>>>;

export interface IGameState {
  players: IPlayer[];
  currentTurn: ITurnState;
  currentAge: AgeId;
  deck: Card[];
  discard: Card[];
  openCards: Ally[];
  dragons: Dragon[];
  regions: RegionsDefinitions;
  flagDefinitions: FlagsDefinitions;
  activeFlags: IActiveFlag[];
  markerHistory: MarkerHistory;
}
