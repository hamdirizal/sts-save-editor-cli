import fs from 'fs';
import z from 'zod';
import { GameCard, GameCardSchema } from '../types.js';

export const getAllCards = (): GameCard[] => {
  let rawdata: any;
  try {
    rawdata = fs.readFileSync('./src/data/cards.json');
  } catch (error) {
    return [];
  }

  let cards: GameCard[];
  try {
    cards = JSON.parse(rawdata);
  } catch (error) {
    return [];
  }

  if (!z.array(GameCardSchema).safeParse(cards).success) {
    return [];
  }

  return cards;
};
