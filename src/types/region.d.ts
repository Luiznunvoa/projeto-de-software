export enum RegionId {
  Forest = 'Forest',
  Mountain = 'Mountain',
  Desert = 'Desert',
  Swamp = 'Swamp',
  Plains = 'Plains',
  Sea = 'Sea'
}

export interface Region {
  id: RegionId;
  adjacentRegions: RegionId[];
  controlTokens: ControlToken[]; // Fichas de controle disponíveis
  tokenLimit: number; // max fichas por jogador (para balanceamento)
}

// Tokens que o usuário ganha por controlar a região no final do turno
export interface ControlToken {
  regionId: RegionId;
  bandSize: number;
}

export type RegionsDefinitions = Record<RegionId, Region>;
