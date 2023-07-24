import { APP_TITLE, APP_VERSION } from './constants.js';

export class Utility {
  public renderArrayAsGrid(arr: string[], colWidth: number, colsCount: number) {
    let result = '';
    let col = 0;
    for (let i = 0; i < arr.length; i++) {
      if (col === colsCount) {
        result += '\n';
        col = 0;
      }
      result += arr[i].padEnd(colWidth, ' ');
      col++;
    }
    console.info(result);
  }

  public searchArray(search: string, items: string[]): string | string[] {
    const searchLower = search.toLowerCase(); // Convert search to lowercase
    const matchingItems = items.filter((item) => item.toLowerCase().includes(searchLower));

    if (matchingItems.length === 0) {
      return search; // Return the search key itself as a plain string
    } else if (matchingItems.length === 1) {
      return matchingItems[0]; // Return the single matching item as a plain string
    } else {
      return matchingItems; // Return multiple matching items as an array
    }
  }
}
