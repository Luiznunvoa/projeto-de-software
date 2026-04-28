export enum TribeId {
  Skeleton = 'Skeleton',
  Mage = 'Mage',
  Elf = 'Elf',
  Giant = 'Giant'
}

export interface ITribe {
  id: TribeId;
  name: string;
  description: string;
}
