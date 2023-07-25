import tk from 'terminal-kit';
import { renderHeader } from '../utils.js';
import { Preset } from '../types.js';
import { preset__single } from './preset__single.js';
import {
  getPresetDataByFilename,
  setGoldInThePresetObj,
  writePresetObjToDisk,
} from '../helpers/preset-helper.js';

const term = tk.terminal;

export const preset__setGold = (presetName: string) => {
  const presetObj: Preset | null = getPresetDataByFilename(presetName);

  renderHeader();
  term.cyan(`Preset: `);
  term(presetName);
  term('\n\n');
  term.cyan(`Gold : `);
  term(presetObj.gold);
  term('\n\n');
  term.cyan('Enter the gold amount: ');
  term.inputField(
    {
      autoCompleteMenu: false,
      autoCompleteHint: false,
      cancelable: true,
    },
    (error, input) => {
      //If cancelled, return to the preset management page
      if (input === undefined) {
        return preset__single(presetName);
      }
      // If input is empty, loop back to this page
      if (!input.trim()) {
        return preset__setGold(presetName);
      }

      // Input must be a valid gold amount
      const parsedValue: number = parseInt(input);
      if (isNaN(parsedValue)) {
        return preset__setGold(presetName);
      }

      if (parsedValue < 0 || parsedValue > 9999) {
        return preset__setGold(presetName);
      }

      // Otherwise, value is valid, back to the preset details page
      const updatedPresetObj: Preset = setGoldInThePresetObj(parsedValue, presetObj);
      writePresetObjToDisk(presetName, updatedPresetObj);
      return preset__single(presetName);
    }
  );
};
