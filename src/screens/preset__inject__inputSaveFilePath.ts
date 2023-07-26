import tk from 'terminal-kit';
import fs from 'fs';
import { readAppDataFromDisk, renderHeader, writeAppDataToDisk } from '../utils.js';
import { getPresetDataByFilename } from '../helpers/preset-helper.js';
import { GameCard, GameRelic, Preset, SaveCard, SaveObject } from '../types.js';
import { preset__management } from './preset__management.js';
import { getAllCards, getCardById } from '../helpers/card-helper.js';
import { getAllRelics, getRelicById } from '../helpers/relic-helper.js';
import { isDirectory, readSaveDataFromDisk, writeSaveDataToDisk } from '../helpers/save-helper.js';
import { preset__inject__success } from './preset__inject__success.js';
import { preset__single } from './preset__single.js';
import { preset__inject__chooseFile } from './preset__inject__chooseFile.js';

const term = tk.terminal;

export const preset__inject__inputSaveFilePath = (presetName: string, errorMessage: string) => {
  renderHeader();
  if (errorMessage) {
    term.red(errorMessage + '\n');
  }
  const appDataObj = readAppDataFromDisk();
  term.cyan('Enter the path to the save folder. \n<ENTER> to confirm. <ESC> to go back. \n');
  term.inputField(
    { autoCompleteMenu: false, cancelable: true, default: appDataObj.saveFilePath },
    (error, input) => {
      const isCanceled = input === undefined;
      if (input === undefined) {
        return preset__single(presetName);
      }
      const path: string = input.trim();

      const isEmpty = path === '';
      if (isEmpty) {
        return preset__inject__inputSaveFilePath(
          presetName,
          'Please enter path to the save folder.'
        );
      }

      if (!isDirectory(path)) {
        return preset__inject__inputSaveFilePath(presetName, 'Please enter a valid path.');
      }
      appDataObj.saveFilePath = path;
      writeAppDataToDisk(appDataObj);

      return preset__inject__chooseFile(presetName, '');
    }
  );
};
