import type { IAlly, ICard, IDragon } from '@/types/card';
import type { ITable } from '@/types/table';

export class Table implements ITable {
  deck: ICard[];
  discard: ICard[];
  openCards: IAlly[];
  dragons: IDragon[];

  constructor(initialState: ITable) {
    Object.assign(this, initialState);
  }

  private isDragon(card: ICard): card is IDragon {
    return 'flag' in card;
  }

  public drawCard(): ICard | undefined {
    if (this.deck.length === 0) {
      this.shuffle();
    }
    if (this.deck.length === 0) {
      throw new Error('Sem cartas no deck e no descarte');
    }

    const card = this.deck.shift()!;

    if (this.isDragon(card)) {
      this.dragons.push(card);
      return undefined;
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
