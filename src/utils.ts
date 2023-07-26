import fs from 'fs'
import { APP_DATA_FILENAME, APP_TITLE, APP_VERSION } from './constants.js';

export const renderHeader = () => {
  console.clear();
  const title = ` ${APP_TITLE} v.${APP_VERSION} `;
  const totalLength = 120;
  const beforeLength = Math.floor((totalLength - title.length) / 2);
  const afterLength = totalLength - (title.length + beforeLength);
  console.info(`${'='.repeat(beforeLength)}${title}${'='.repeat(afterLength)}`);
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

export const readAppDataFromDisk = () => {
  const defaultAppData = {
    saveFilePath: ''
  }
  
  if(!fs.existsSync(`./${APP_DATA_FILENAME}`)){
    fs.writeFileSync(`./${APP_DATA_FILENAME}`, JSON.stringify(defaultAppData));
    return defaultAppData;
  }

  let content;
  try {
    content = fs.readFileSync(`./${APP_DATA_FILENAME}`, 'utf8');
  } catch (error) {
    return defaultAppData;
  }

  let obj;
  try {
    obj = JSON.parse(content);
  } catch (error) {
    return defaultAppData;
  }

  return obj;
}

export const writeAppDataToDisk = (obj: any) => {
  fs.writeFileSync(`./${APP_DATA_FILENAME}`, JSON.stringify(obj));
}