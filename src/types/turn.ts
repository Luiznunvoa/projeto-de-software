import type { IPlayer, IBand } from './player';

export enum TurnPhaseId {
  ChooseAction = 'ChooseAction',
  Draw = 'Draw',
  BandCommand = 'BandCommand',
  PowerCommand = 'PowerCommand'
}

export interface ITurnState {
  playerId: IPlayer['id'];
  phase: TurnPhaseId;
  currentBand?: IBand;
}
