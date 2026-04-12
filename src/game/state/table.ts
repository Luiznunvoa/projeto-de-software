import type { IAlly, ICard, IDragon } from '@/types/card';
import type { ITable } from '@/types/table';

export class Table implements ITable {
  deck: ICard[];
  discard: ICard[];
  openCards: IAlly[];
  dragons: IDragon[];

  constructor(cards: ICard[]) {
    this.deck = cards;
    this.discard = [];
    this.openCards = [];
    this.dragons = [];
  }

  public isDragon(card: ICard): card is IDragon {
    return 'flag' in card;
  }

  public isAlly(card: ICard): card is IAlly {
    return 'tribe' in card;
  }

  public drawCard(drawDragons = true): ICard | undefined {
    if (this.deck.length === 0) {
      this.shuffle();
    }

    if (this.deck.length === 0) {
      throw new Error('Sem cartas no deck e no descarte');
    }

    let card = this.deck.shift()!;

    if (this.isDragon(card)) {
      if (drawDragons) {
        this.dragons.push(card);
        return undefined;
      }

      while (this.isDragon(card)) {
        this.deck.push(card);
        card = this.deck.shift()!;
      }
    }

    return card;
  }

  public shuffle(): void {
    const shuffled = [...this.discard].sort(() => Math.random() - 0.5);
    this.deck.push(...shuffled);
    this.discard = [];
  }

  public receiveCards(cards: ICard[]): void {
    this.discard.push(...cards);
  }

  public reset(): void {
    this.deck.push(...this.dragons, ...this.openCards, ...this.discard);

    this.dragons = [];
    this.openCards = [];
    this.discard = [];

    this.shuffle();
  }
}
