import type { IBand } from '@/types/player';
import type { ITurnState, TurnPhaseId } from '@/types/turn';

export class Turn implements ITurnState {
  playerId: number;
  phase: TurnPhaseId;
  currentBand?: IBand;
  drawnThisTurn: boolean;

  constructor(initialState: ITurnState) {
    Object.assign(this, initialState);
  }

  public nextPhase(phase: TurnPhaseId): void {
    this.phase = phase;
  }

  public setDrawnThisTurn(drawn: boolean): void {
    this.drawnThisTurn = drawn;
  }

  public setBandCommand(band: IBand): void {
    this.currentBand = band;
  }

  public clearBandCommand(): void {
    this.currentBand = undefined;
  }
}
