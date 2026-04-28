export enum RegionId {
  Forest = 'Forest',
  Mountain = 'Mountain',
  Desert = 'Desert',
  Swamp = 'Swamp',
  Plains = 'Plains',
  Sea = 'Sea'
}

export interface IControlToken {
  value: number;
}

export interface IRegion {
  id: RegionId;
  adjacentRegions: RegionId[];
  controlTokens: IControlToken[];
  tokenLimit: number;
  bandSize: number;
}

export type RegionsDefinitions = Record<RegionId, IRegion>;
