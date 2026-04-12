import type { IBand } from '@/types/player';
import type { ITurnState, TurnPhaseId } from '@/types/turn';

export class Turn implements ITurnState {
  playerId: number;
  phase: TurnPhaseId;
  currentBand?: IBand;

  constructor(initialState: ITurnState) {
    Object.assign(this, initialState);
  }

  public nextPhase(phase: TurnPhaseId): void {
    this.phase = phase;
  }

  public setBandCommand(band: IBand): void {
    this.currentBand = band;
  }

  public clearBandCommand(): void {
    this.currentBand = undefined;
  }
}
