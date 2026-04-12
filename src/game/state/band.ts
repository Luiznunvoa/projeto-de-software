import type { IAlly } from '@/types/card';
import type { IBand } from '@/types/player';
import type { RegionId } from '@/types/region';
import type { TribeId } from '@/types/tribe';

export class Band implements IBand {
  cards: IAlly[];
  tribe: TribeId; // raça do bando (todas as cartas devem ser da mesma raça)
  targetRegion: RegionId;
  playerId: number;
  leaderIndex: number; // Index do leader no array de cartas

  constructor(initialState: IBand) {
    Object.assign(this, initialState);
  }

  public triggerTribePower() {
    return {}; // TODO
  }

  public calcPower() {
    return {}; // TODO
  }
}
