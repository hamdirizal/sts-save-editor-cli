import fs from 'fs';
// import { renderArrayAsGrid } from "./utils.js";
import { CardWithTitle } from './types.js';

export class CardService {
  private readCardsFromFile() {
    let rawdata: any = fs.readFileSync('./src/cards.json');
    return JSON.parse(rawdata);
  }

  public getDisplayNameById(id: number, cards: CardWithTitle[]): string {
    const name = cards.find((c) => c.id === id).title;
    return `[${id}] ${name}`;
  }

  public transformIdsToReadableNames(cardIds: number[]): string[] {
    const cards: CardWithTitle[] = this.getCardList();
    const sortedIds = cardIds.sort((a, b) => a - b);
    const names: string[] = sortedIds.map((id: number) => {
      return this.getDisplayNameById(id, cards);
    });

    return names;
  }

  public getCardList(): CardWithTitle[] {
    const cards = this.readCardsFromFile();
    const keys = Object.keys(cards);
    const arr = [];
    keys.forEach((key) => {
      arr.push({
        identifier: key,
        title: cards[key].NAME,
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

    const indexed: CardWithTitle[] = sorted.map((item, index) => {
      return {
        id: index,
        title: item.title,
        identifier: item.identifier,
      };
    });

    return indexed;
  }
}
