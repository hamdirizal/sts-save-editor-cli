import fs from 'fs';
// import { renderArrayAsGrid } from "./utils.js";
import { Card } from './types.js';

export class CardService {
  private readCardsFromFile(){
    let rawdata: any = fs.readFileSync('./src/cards.json');
    return JSON.parse(rawdata);
  }
  
  public getCardList():Card[] {
    const cards = this.readCardsFromFile();
    const keys = Object.keys(cards);
    const arr = [];
    keys.forEach(key => {
      arr.push({
        identifier: key,
        title: cards[key].NAME
      });
    });
  
    // Sort by name
    const sorted = arr.sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });
  
    const indexed: Card[] = sorted.map((item, index) => {
      return {
        id: index,
        title: item.title,
        identifier: item.identifier
      }
    })
  
    return indexed;
  }
  
}