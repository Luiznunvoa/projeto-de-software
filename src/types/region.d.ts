export enum RegionId {
  Forest = 'Forest',
  Mountain = 'Mountain',
  Desert = 'Desert',
  Swamp = 'Swamp',
  Plains = 'Plains',
  Sea = 'Sea'
}

export interface ControlToken { 
  value: number;
}

export interface Region {
  id: RegionId;
  adjacentRegions: RegionId[];
  controlTokens: ControlToken[];
  tokenLimit: number;
  bandSize: number;
}

export type RegionsDefinitions = Record<RegionId, Region>;
