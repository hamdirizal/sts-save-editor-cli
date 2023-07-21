import { APP_TITLE, APP_VERSION } from "./constants.js";

export class Utility {

  public renderArrayAsGrid (arr: string[], colWidth: number, colsCount: number) {
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
    console.info(result)
  }

}