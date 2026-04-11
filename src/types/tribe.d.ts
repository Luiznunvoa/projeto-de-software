export enum TribeId {
  Skeleton = 'Skeleton',
  Mage = 'Mage',
  Elf = 'Elf',
  Giant = 'Giant'
}

export interface Tribe {
  id: TribeId;
  name: string;
  description: string;
}
