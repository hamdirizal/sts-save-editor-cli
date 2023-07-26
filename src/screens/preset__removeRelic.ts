import tk from 'terminal-kit';
import { renderArrayAsGrid2, renderHeader, searchArray } from '../utils.js';
import { GameRelic, Preset } from '../types.js';
import { preset__single } from './preset__single.js';
import { extractIdFromRelicName, getAllRelics, getRelicNameById } from '../helpers/relic-helper.js';
import {
  getPresetDataByFilename,
  removeRelicIdFromPresetObj,
  writePresetObjToDisk,
} from '../helpers/preset-helper.js';

const term = tk.terminal;

export const preset__removeRelic = (presetName: string) => {
  const allRelics: GameRelic[] = getAllRelics();
  const presetObj: Preset | null = getPresetDataByFilename(presetName);
  const relicNamesInThisPreset: string[] = presetObj.relics
    .map((id) => {
      return getRelicNameById(id, allRelics);
    })
    .filter((name) => name !== '');

  renderHeader();
  term.cyan(`Preset: `);
  term(presetName);
  term('\n\n');
  term.cyan(`Relics (${relicNamesInThisPreset.length}): \n`);
  renderArrayAsGrid2(relicNamesInThisPreset, 120);
  term('\n\n');
  term.cyan(
    'Enter relic name to be removed. \n<ENTER> to confirm. <TAB> to autocomplete. <ESC> to go back.\n'
  );
  term.inputField(
    {
      autoComplete: (input) => searchArray(input, relicNamesInThisPreset),
      autoCompleteMenu: true,
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
        return preset__removeRelic(presetName);
      }
      const isCardNameAvailable: boolean = relicNamesInThisPreset.indexOf(input) >= 0;
      if (!isCardNameAvailable) {
        return preset__removeRelic(presetName);
      }

      const relicIdToBeRemoved: number = extractIdFromRelicName(input);
      const updatedPresetObj: Preset = removeRelicIdFromPresetObj(relicIdToBeRemoved, presetObj);
      writePresetObjToDisk(presetName, updatedPresetObj);
      return preset__removeRelic(presetName);
    }
  );
};
