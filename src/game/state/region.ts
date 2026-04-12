import type { IControlToken, IRegion, RegionId } from '@/types/region';

export class Region implements IRegion {
  id: RegionId;
  adjacentRegions: RegionId[];
  controlTokens: IControlToken[];
  tokenLimit: number;
  bandSize: number;

  constructor(initialState: IRegion) {
    Object.assign(this, initialState);
  }

  public isAdjacent(regionId: RegionId): boolean {
    return this.adjacentRegions.includes(regionId);
  }

  public isBandBigEnough(bandCardsCount: number): boolean {
    return bandCardsCount >= this.bandSize;
  }

  public addControlToken(token: IControlToken): void {
    if (this.controlTokens.length >= this.tokenLimit) {
      throw new Error(`Limite de tokens na região ${this.id} atingido.`);
    }

    this.controlTokens.push(token);
  }

  public removeControlToken(): IControlToken | undefined {
    return this.controlTokens.pop();
  }
}
