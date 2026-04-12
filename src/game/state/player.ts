import { MAX_HAND_SIZE } from '@/consts';

import type { IAlly } from '@/types/card';
import type { IPlayer, IPlayerStats } from '@/types/player';

export class Player implements IPlayer {
  readonly id: number;
  readonly name: string;
  readonly color: string;
  hand: IAlly[];
  stats: IPlayerStats;
  controlTokens: number;
  markersLeft: number;

  constructor(initialState: IPlayer) {
    Object.assign(this, initialState);
  }

  public getState(): IPlayer {
    return structuredClone(this);
  }

  public getCard(card: IAlly): void {
    if (this.hand.length >= MAX_HAND_SIZE) {
      throw new Error('Mão cheia');
    }

    this.hand.push(card);
  }

  public giveCards(selectedCards: number[]): IAlly[] {
    const givenCards: IAlly[] = [];
    const remainingHand: IAlly[] = [];

    for (const card of this.hand) {
      if (selectedCards.includes(card.id)) {
        givenCards.push(card);
      } else {
        remainingHand.push(card);
      }
    }

    this.hand = remainingHand;
    return givenCards;
  }

  public discartCards(): IAlly[] {
    const discarded = [...this.hand];
    this.hand = [];
    return discarded;
  }
}
