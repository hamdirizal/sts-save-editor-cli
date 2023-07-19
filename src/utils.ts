import fs from 'fs';
import { AppState } from './types.js';
import { APP_STATE_FILENAME } from './constants.js';

export const readAppState = (): AppState => {
  const defaultValue: AppState = {
    gameSavePath: ''
  }
  //If file not exists, return default object, and create the file
  if(!fs.existsSync(`./${APP_STATE_FILENAME}`)) {
    fs.writeFileSync(`./${APP_STATE_FILENAME}`, JSON.stringify(defaultValue));
    return defaultValue;
  }

  //If file exists, read it and return the object
  const fileContent = fs.readFileSync(`./${APP_STATE_FILENAME}`, 'utf-8');
  if(fileContent) {
    return JSON.parse(fileContent);
  }

  return defaultValue;
};

export const writeAppState = (appState: AppState) => {
  fs.writeFileSync(`./${APP_STATE_FILENAME}`, JSON.stringify(appState));
};

export const renderHr = () => {
  console.info('_'.repeat(120))
}

export const renderAppHeader = () => {
  console.clear();
  const title = 'Slay the Spire save editor. v0.0.1';
  const totalLength = 120;
  const beforeLength = Math.floor((totalLength - title.length) / 2);
  const afterLength = totalLength - (title.length + beforeLength);
  console.info(`${'='.repeat(beforeLength)}${title}${'='.repeat(afterLength)}`);
}

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
  console.info(result)
}