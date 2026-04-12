import type { IAlly } from '@/types/card';
import type { IBand } from '@/types/player';
import type { RegionId } from '@/types/region';
import type { TribeId } from '@/types/tribe';

export class Band implements IBand {
  cards: IAlly[];
  tribe: TribeId;
  targetRegion: RegionId;
  playerId: number;
  leaderIndex: number;

  constructor(band: Omit<IBand, 'tribe'>) {
    const initialState: IBand = { ...band, tribe: band.cards[band.leaderIndex].tribe };

    Object.assign(this, initialState);
  }

  public triggerTribePower() {
    return {}; // TODO
  }

  public calcPower() {
    return {}; // TODO
  }
}
