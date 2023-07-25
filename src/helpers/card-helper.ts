import fs from 'fs';
import z from 'zod';
import { CardNameSchema, GameCard, GameCardSchema } from '../types.js';

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

export const getCardNameById = (id: number, allCards: GameCard[]): string => {
  const card: GameCard = allCards.find((c) => {
    return c.title.substring(1).split(']')[0] === id.toString();
  });
  if (card) {
    return card.title;
  }
  return '';
};

export const extractIdFromCardName = (cardName: string): number => {
  if (!CardNameSchema.safeParse(cardName).success) {
    return -1;
  }
  return parseInt(cardName.substring(1).split(']')[0]);
};