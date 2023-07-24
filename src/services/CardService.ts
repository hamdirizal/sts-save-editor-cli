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
      return this.getCardIdFromTitle(c.title) === id;
    });
  }

  public isCardIdValid(id: number): boolean {
    const cards = this.getCardList();
    return cards.some((c) => {
      return this.getCardIdFromTitle(c.title) === id;
    });
  }

  public getCardIdFromTitle(title: string): number {
    return parseInt(title.substring(1).split(']')[0]);
  }


  public getCardList(): GameCard[] {
    return this.readCardsFromFile();
  }
}
