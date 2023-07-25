import { z } from 'zod';

export const CardNameSchema = z.string().regex(/\[\d+\] .+/g);

export const GameCardSchema = z.object({
  title: CardNameSchema,
  identifier: z.string(),
});

export type GameCard = z.infer<typeof GameCardSchema>;

export const RelicNameSchema = z.string().regex(/\[\d+\] .+/g);

export const GameRelicSchema = z.object({
  title: RelicNameSchema,
  identifier: z.string(),
});

export type GameRelic = z.infer<typeof GameRelicSchema>;

export interface RelicWithTitle {
  id: number;
  title: string;
  identifier: string;
}

export const PresetSchema = z.object({
  gold: z.number(),
  cards: z.array(z.number()),
  relics: z.array(z.number()),
});

export type Preset = z.infer<typeof PresetSchema>;

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
