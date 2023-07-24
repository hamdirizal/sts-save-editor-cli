export interface AppState {
  gameSavePath: string;
}

export interface Person {
  name: string;
  age: number;
}

export interface CardWithTitle {
  id: number;
  title: string;
  identifier: string;
}

export interface RelicWithTitle {
  id: number;
  title: string;
  identifier: string;
}

export interface Preset {
  gold: number;
  cards: number[];
  relics: number[];
}

export interface InquirerListOption {
  value: string;
  name: string;
}

export interface ListOption {
  value: string;
  name: string;
}

export interface SaveCard {
  upgrades: number;
  misc: number;
  id: string;
}

export interface SaveObject {
  name: string;
  gold: number;
  relics: string[];
  cards: SaveCard[];
}