import type { GameFlagId } from './flags';
import type { TribeId } from './tribe';

export interface ICard {
  id: number;
  name: string;
  description: string;
}

export interface IAlly extends ICard {
  tribe: TribeId;
}

export interface IDragon extends ICard {
  flag: GameFlagId;
}
