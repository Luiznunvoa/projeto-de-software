import type { IDragon, ICard, IAlly } from './card';
import type { RegionsDefinitions } from './region';

export interface ITable {
  deck: ICard[];
  discard: ICard[];
  openCards: IAlly[];
  dragons: IDragon[];
}
