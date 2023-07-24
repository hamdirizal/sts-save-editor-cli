import fs from 'fs';
// import { renderArrayAsGrid } from "./utils.js";
import { GameCard } from '../types.js';

export class CardService {
  private readCardsFromFile() {
    let rawdata: any = fs.readFileSync('./src/data/cards.json');
    return JSON.parse(rawdata);
  }

  public getSingleCardById(id: number): GameCard {
    const cards = this.readCardsFromFile();
    return cards.find((c) => {
      return c.substring(1).split(']')[0] === id.toString();
    });
  }

  public getCardList(): GameCard[] {
    return this.readCardsFromFile();
  }
}
