import type { Dragon, Card, Ally } from './card';
import type { RegionsDefinitions } from './region';

export interface ITable {
  #deck: Card[];
  #discard: Card[];
  #openCards: Ally[];
  #dragons: Dragon[];
  #regions: RegionsDefinitions;
}
