import type { Player, Band } from './player';

export enum TurnPhaseId {
  Draw = 'Draw',
  Action = 'Action',
  BandCommand = 'BandCommand',
  NextPlayer = 'NextPlayer',
  GameOver = 'GameOver'
}

export interface TurnState {
  playerId: Player['id'];
  phase: TurnPhaseId;
  currentBand?: Band;
  drawnThisTurn: boolean;
}
