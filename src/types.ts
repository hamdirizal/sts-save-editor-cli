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
  cards: CardWithTitle[];
  relics: RelicWithTitle[];
}