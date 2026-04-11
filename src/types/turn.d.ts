import type { IPlayer, IBand } from './player';

export enum TurnPhaseId {
  Draw = 'Draw',
  Action = 'Action',
  BandCommand = 'BandCommand',
  NextPlayer = 'NextPlayer',
  GameOver = 'GameOver'
}

export interface ITurnState {
  playerId: IPlayer['id'];
  phase: TurnPhaseId;
  currentBand?: IBand;
  drawnThisTurn: boolean;
}
