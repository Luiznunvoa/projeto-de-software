export enum GameFlagId {
  DragonFury   = 'DragonFury',
  ScorchedLand = 'ScorchedLand',
  ArcaneStorm  = 'ArcaneStorm',
}

export interface GameFlag {
  id: GameFlagId;
  name: string;
  description: string;
}

export interface ActiveFlag {
  definition: GameFlag
  sourceDragonId: Dragon['id'];
  sourcePlayerId: Player['id'] | null;
  age: AgeId;
}

export type FlagsDefinitions = Record<GameFlagId, GameFlag>

