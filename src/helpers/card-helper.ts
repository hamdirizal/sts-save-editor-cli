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

export const getCardById = (id: number, allCards: GameCard[]): GameCard | null => {
  const card: GameCard | undefined = allCards.find((c) => {
    return extractIdFromCardName(c.title) === id;
  });
  if (card) {
    return card;
  }
  return null;
};

export const getCardNameById = (id: number, allCards: GameCard[]): string => {
  const card: GameCard = allCards.find((c) => {
    return extractIdFromCardName(c.title) === id;
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
