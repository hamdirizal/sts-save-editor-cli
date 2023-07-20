import fs from 'fs';
import { Relic } from './types.js';

export class RelicService {
  private readRelicsFromFile(){
    let rawdata: any = fs.readFileSync('./src/relics.json');
    return JSON.parse(rawdata);
  }

  public getRelicList(): Relic[] {
    const relics = this.readRelicsFromFile();
    const keys = Object.keys(relics);
    const arr = [];
    keys.forEach(key => {
      arr.push({
        identifier: key,
        title: relics[key].NAME
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
  
    const indexed: Relic[] = sorted.map((item, index) => {
      return {
        id: index,
        title: item.title,
        identifier: item.identifier
      }
    })
  
    return indexed;
  }
}