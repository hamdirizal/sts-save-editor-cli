export const renderHeader = () => {
  console.clear();
  console.info('===MY APP===');
};

export const renderArrayAsGrid = (arr: string[], colWidth: number, colsCount: number) => {
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
};

export const renderArrayAsGrid2 = (arr: string[], screenWidth: number) => {
  const longestString: string = arr.reduce((a, b) => (a.length > b.length ? a : b), '');
  const colWidth = longestString.length + 2;
  const colsCount = Math.floor(screenWidth / colWidth);
  renderArrayAsGrid(arr, colWidth, colsCount);
};

export const searchArray = (keyword: string, items: string[]): string | string[] => {
  const searchLower = keyword.toLowerCase();
  const matchingItems = items.filter((item) => item.toLowerCase().includes(searchLower));
  if (matchingItems.length === 0) {
    return keyword;
  } else if (matchingItems.length === 1) {
    return matchingItems[0];
  } else {
    return matchingItems;
  }
};
