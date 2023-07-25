import fs from 'fs';
import z from 'zod';
import { GameRelic, GameRelicSchema, RelicNameSchema } from '../types.js';

export const getAllRelics = (): GameRelic[] => {
  let rawdata: any;
  try {
    rawdata = fs.readFileSync('./src/data/relics.json');
  } catch (error) {
    return [];
  }

  let relics: GameRelic[];
  try {
    relics = JSON.parse(rawdata);
  } catch (error) {
    return [];
  }

  if (!z.array(GameRelicSchema).safeParse(relics).success) {
    return [];
  }

  return relics;
};

export const getRelicNameById = (id: number, allRelics: GameRelic[]): string => {
  const relic: GameRelic = allRelics.find((r) => {
    return extractIdFromRelicName(r.title) === id;
  });
  if (relic) {
    return relic.title;
  }
  return '';
};

export const extractIdFromRelicName = (relicName: string): number => {
  if (!RelicNameSchema.safeParse(relicName).success) {
    return -1;
  }
  return parseInt(relicName.substring(1).split(']')[0]);
};