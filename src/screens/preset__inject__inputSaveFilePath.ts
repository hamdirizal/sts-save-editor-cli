import tk from 'terminal-kit';
import { renderHeader } from '../utils.js';
import { getPresetDataByFilename } from '../helpers/preset-helper.js';
import { GameCard, GameRelic, Preset, SaveCard, SaveObject } from '../types.js';
import { preset__management } from './preset__management.js';
import { getAllCards, getCardById } from '../helpers/card-helper.js';
import { getAllRelics, getRelicById } from '../helpers/relic-helper.js';
import { readSaveDataFromDisk, writeSaveDataToDisk } from '../helpers/save-helper.js';
import { preset__inject__success } from './preset__inject__success.js';

const term = tk.terminal;

export const preset__inject__inputSaveFilePath = (presetName: string, errorMessage: string) => {
  renderHeader();
  if (errorMessage) {
    term.red(errorMessage + '\n');
  }
  term.cyan('Enter the path to the save file. \n<ENTER> to confirm. <ESC> to go back. \n');
  term.inputField({ autoCompleteMenu: false, cancelable: true }, (error, input) => {
    //If cancelled, return to the preset management page
    if (input === undefined) {
      return preset__management();
    }
    const path: string = input.trim();
    // If input is empty, loop back to this page
    if (!path) {
      return preset__inject__inputSaveFilePath(presetName, 'Please enter a valid path.');
    }

    const saveDataObject: SaveObject | null = readSaveDataFromDisk(path);

    if (!saveDataObject) {
      return preset__inject__inputSaveFilePath(presetName, 'Failed to read save file from disk.');
    }
    if (!saveDataObject?.name) {
      return preset__inject__inputSaveFilePath(presetName, 'Invalid save file.');
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

    // Show injection success message
    return preset__inject__success(presetName);
  });
};
