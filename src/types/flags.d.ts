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
  #definition: IGameFlag;
  #sourceDragonId: Dragon['id'];
  #sourcePlayerId?: Player['id'];
  #age: AgeId;
}

export type FlagsDefinitions = Record<GameFlagId, IGameFlag>;
