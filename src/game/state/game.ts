import type { IGameState } from '@/types/game';

export interface GameState extends IGameState {}

export class GameState {
  constructor(initialState: IGameState) {
    Object.assign(this, initialState);
  }

  public getState(): IGameState {
    return structuredClone(this);
  }


}