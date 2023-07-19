import relics from "./relics.json" assert { type: "json" };

export const renderHr = () => {
  console.info('_'.repeat(90))
}

export const displayAsGrid = (stringArray, colWidth, numberOfCols) => {
  let result = '';
  let col = 0;
  for (let i = 0; i < stringArray.length; i++) {
    if (col === numberOfCols) {
      result += '\n';
      col = 0;
    }
    result += stringArray[i].padEnd(colWidth, ' ');
    col++;
  }
  console.info(result)
}