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
      const isCanceled: boolean = input === undefined;
      if (isCanceled) {
        return preset__single(presetName);
      }
      const isEmpty: boolean = input.trim() === '';
      if (isEmpty) {
        return preset__setGold(presetName);
      }
      const goldAmountToBeSet: number = parseInt(input);

      if (isNaN(goldAmountToBeSet)) {
        return preset__setGold(presetName);
      }

      if (goldAmountToBeSet < 0 || goldAmountToBeSet > 9999) {
        return preset__setGold(presetName);
      }
      const updatedPresetObj: Preset = setGoldInThePresetObj(goldAmountToBeSet, presetObj);
      writePresetObjToDisk(presetName, updatedPresetObj);
      return preset__single(presetName);
    }
  );
};
