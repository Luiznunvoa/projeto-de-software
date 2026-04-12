import { TurnPhaseId } from '@/types/turn';

import { Band } from './band';
import { Player } from './player';
import { Table } from './table';
import { Turn } from './turn';

import type { IAlly, ICard } from '@/types/card';
import type { FlagsDefinitions, IActiveFlag } from '@/types/flags';
import type { AgeId, IGameState, MarkerHistory } from '@/types/game';
import type { IBand } from '@/types/player';
import type { RegionsDefinitions } from '@/types/region';

export interface IGameConfig {
  playerCount: number;
  cards: ICard[];
  colors: Record<number, string>;
  names: Record<number, string>;
  flagDefinitions: FlagsDefinitions;
  regions: RegionsDefinitions;
}

export class GameState implements IGameState {
  players: Player[];
  currentTurn: Turn;
  currentAge: AgeId;
  table: Table;
  flagDefinitions: FlagsDefinitions;
  activeFlags: IActiveFlag[];
  markerHistory: MarkerHistory;
  regions: RegionsDefinitions;

  constructor(config: IGameConfig) {
    this.table = new Table(config.cards);

    this.players = Array.from({ length: config.playerCount }, (_, id) => {
      const hand = Array.from({ length: 10 }, () => this.table.drawCard(false)).filter(
        (card): card is IAlly => !!card && this.table.isAlly(card)
      );

      return new Player({ id, color: config.colors[id], name: config.names[id], hand });
    });

    this.activeFlags = [];
    this.regions = config.regions;
    this.flagDefinitions = config.flagDefinitions;
  }

  public getState(): IGameState {
    return structuredClone(this);
  }

  public spawnBand(band: Omit<IBand, 'tribe'>): IBand {
    return new Band(band);
  }

  public newTurn(): void {
    const old = this.currentTurn;

    this.currentTurn = new Turn({
      playerId: (old.playerId + 1) % this.players.length,
      phase: TurnPhaseId.ChooseAction
    });
  }
}
