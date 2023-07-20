export class Utility {
  public renderAppHeader() {
    console.clear();
    const title = 'Slay the Spire save editor. v0.0.1';
    const totalLength = 120;
    const beforeLength = Math.floor((totalLength - title.length) / 2);
    const afterLength = totalLength - (title.length + beforeLength);
    console.info(`${'='.repeat(beforeLength)}${title}${'='.repeat(afterLength)}`);
  }

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