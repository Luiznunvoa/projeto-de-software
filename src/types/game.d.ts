import type { Dragon, Card, Ally } from "./card";
import type { Region, RegionId, RegionsDefinitions } from "./region";
import type { Player } from "./player";
import type { TurnState } from "./turn";
import type { FlagsDefinitions, GameFlag, GameFlagId  } from "./flags";

export enum AgeId {
  Prolog = 'Prolog',
  Jorney = 'Jorney',
  Epilog = 'Epilog',
}

export type MarkerHistory = Record<
  AgeId,
  Record<RegionId, Record<Player['id'], number>>
>;

export interface GameState {
  players: Player[];
  currentTurn: TurnState;
  currentAge: AgeId;
  deck: Card[];
  discard: Card[];
  openCards: Ally[];
  dragons: Dragon[];
  regions: RegionsDefinitions;
  flagDefinitions: FlagsDefinitions;
  activeFlags: ActiveFlag[];
  markerHistory: MarkerHistory;
}

