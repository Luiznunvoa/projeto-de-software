import type { IDragon } from './card';
import type { AgeId } from './game';
import type { IPlayer } from './player';

export enum GameFlagId {
  DragonFury = 'DragonFury',
  ScorchedLand = 'ScorchedLand',
  ArcaneStorm = 'ArcaneStorm'
}

export interface IGameFlag {
  id: GameFlagId;
  name: string;
  description: string;
}

export interface IActiveFlag {
  definition: IGameFlag;
  sourceDragonId: IDragon['id'];
  sourcePlayerId?: IPlayer['id'];
  age: AgeId;
}

export type FlagsDefinitions = Record<GameFlagId, IGameFlag>;
