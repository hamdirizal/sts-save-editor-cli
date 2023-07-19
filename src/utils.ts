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