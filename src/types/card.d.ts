import type { TribeId } from "./tribe";
import type { GameFlagId } from "./game";

export interface Card {
  id: number;
  name: string;
  description: string;
}

export interface Ally extends Card {
  tribe: TribeId;
}

export interface Dragon extends Card {
  flag: GameFlagId;
}
