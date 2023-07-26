import tk from 'terminal-kit';
import { renderArrayAsGrid2, renderHeader, searchArray } from '../utils.js';
import { GameRelic, Preset } from '../types.js';
import { preset__single } from './preset__single.js';
import {
  addRelicIdToPresetObj,
  getPresetDataByFilename,
  writePresetObjToDisk,
} from '../helpers/preset-helper.js';
import { extractIdFromRelicName, getAllRelics, getRelicNameById } from '../helpers/relic-helper.js';

const term = tk.terminal;

export const preset__addRelic = (presetName: string) => {
  const allRelics: GameRelic[] = getAllRelics();
  const allRelicNames: string[] = allRelics.map((c) => c.title);
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
    'Enter relic name to be added to this preset. \n<ENTER> to confirm. <TAB> to autocomplete. <ESC> to go back.\n'
  );
  term.inputField(
    {
      autoComplete: (input) => searchArray(input, allRelicNames),
      autoCompleteMenu: true,
      autoCompleteHint: false,
      cancelable: true,
    },
    (error, input) => {
      const isCanceled = input === undefined;
      if (isCanceled) {
        return preset__single(presetName);
      }
      const isEmpty = input.trim() === '';
      if (isEmpty) {
        return preset__addRelic(presetName);
      }
      const isRelicAvailable = allRelicNames.indexOf(input) >= 0;
      if (isRelicAvailable) {
        return preset__addRelic(presetName);
      }
      const relicIdToBeAdded: number = extractIdFromRelicName(input);
      const updatedPresetObj: Preset = addRelicIdToPresetObj(relicIdToBeAdded, presetObj);
      writePresetObjToDisk(presetName, updatedPresetObj);
      return preset__addRelic(presetName);
    }
  );
};
