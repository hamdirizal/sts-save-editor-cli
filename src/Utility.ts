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

  public renderArrayAsGrid2(arr: string[], screenWidth: number){
    // Get the longest string in the array
    const longestStringLength = arr.reduce((a, b) => a.length > b.length ? a : b, '');
    // Add 2 to the length of the longest string to account for the padding
    const colWidth = longestStringLength.length + 2;
    // Calculate the number of columns that can fit on the screen
    const colsCount = Math.floor(screenWidth / colWidth);
    // Render the array as a grid
    this.renderArrayAsGrid(arr, colWidth, colsCount);
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
