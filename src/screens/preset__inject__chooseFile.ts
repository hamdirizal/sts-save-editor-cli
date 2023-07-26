import tk from 'terminal-kit';
import fs from 'fs';
import {
  readAppDataFromDisk,
  renderArrayAsGrid2,
  renderHeader,
  writeAppDataToDisk,
} from '../utils.js';
import { getPresetDataByFilename } from '../helpers/preset-helper.js';
import { GameCard, GameRelic, ListOption, Preset, SaveCard, SaveObject } from '../types.js';
import { preset__management } from './preset__management.js';
import { getAllCards, getCardById } from '../helpers/card-helper.js';
import { getAllRelics, getRelicById } from '../helpers/relic-helper.js';
import {
  isDirectory,
  readFilesInSaveDirectory,
  readSaveDataFromDisk,
  writeSaveDataToDisk,
} from '../helpers/save-helper.js';
import { preset__inject__success } from './preset__inject__success.js';
import { preset__inject__inputSaveFilePath } from './preset__inject__inputSaveFilePath.js';

const term = tk.terminal;

export const preset__inject__chooseFile = (presetName: string, errorMessage: string) => {
  renderHeader();
  if (errorMessage) {
    term.red(errorMessage + '\n');
  }

  const allFiles = readFilesInSaveDirectory();
  term.cyan('Select file: \n');

  term.singleColumnMenu(allFiles, { cancelable: true }, (error, response) => {    
    if (response.canceled) {
      return preset__inject__inputSaveFilePath(presetName, '');
    }
    const path = readAppDataFromDisk().saveFilePath + '\\' + allFiles[response.selectedIndex];
    const saveDataObject: SaveObject | null = readSaveDataFromDisk(path);

    if (!saveDataObject) {
      return preset__inject__chooseFile(presetName, 'Failed to read save file from disk.');
    }
    if (!saveDataObject?.name) {
      return preset__inject__chooseFile(presetName, 'Invalid save file.');
    }

    const allCards: GameCard[] = getAllCards();
    const allRelics: GameRelic[] = getAllRelics();

    const presetObj: Preset = getPresetDataByFilename(presetName);

    const cardsToBeSaved: SaveCard[] = presetObj.cards.map((cid) => {
      return {
        id: getCardById(cid, allCards).identifier,
        upgrades: 0,
        misc: 0,
      };
    });

    const relicIdentifiers: string[] = presetObj.relics.map((rid) => {
      return getRelicById(rid, allRelics).identifier;
    });

    const newSaveDataObject: SaveObject = {
      ...saveDataObject,
      gold: presetObj.gold,
      cards: cardsToBeSaved,
      relics: relicIdentifiers,
    };
    writeSaveDataToDisk(path, newSaveDataObject);
    return preset__inject__success(presetName);
  });
};
