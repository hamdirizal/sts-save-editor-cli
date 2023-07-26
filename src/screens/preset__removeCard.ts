import tk from 'terminal-kit';
import { renderArrayAsGrid2, renderHeader, searchArray } from '../utils.js';
import { GameCard, Preset } from '../types.js';
import { preset__single } from './preset__single.js';
import { extractIdFromCardName, getAllCards, getCardNameById } from '../helpers/card-helper.js';
import {
  getPresetDataByFilename,
  removeCardIdFromPresetObj,
  writePresetObjToDisk,
} from '../helpers/preset-helper.js';

const term = tk.terminal;

export const preset__removeCard = (presetName: string) => {
  const allCards: GameCard[] = getAllCards();
  const presetObj: Preset | null = getPresetDataByFilename(presetName);
  const cardNamesInThisPreset: string[] = presetObj.cards
    .map((id) => {
      return getCardNameById(id, allCards);
    })
    .filter((name) => name !== '');

  renderHeader();
  term.cyan(`Preset: `);
  term(presetName);
  term('\n\n');
  term.cyan(`Cards (${cardNamesInThisPreset.length}): \n`);
  renderArrayAsGrid2(cardNamesInThisPreset, 120);
  term('\n\n');
  term.cyan(
    'Enter card name to be removed. \n<ENTER> to confirm. <TAB> to autocomplete. <ESC> to go back.\n'
  );
  term.inputField(
    {
      autoComplete: (input) => searchArray(input, cardNamesInThisPreset),
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
        return preset__removeCard(presetName);
      }
      const isCardNameAvailable: boolean = cardNamesInThisPreset.indexOf(input) >= 0;
      if (!isCardNameAvailable) {
        return preset__removeCard(presetName);
      }
      
      const cardIdToBeRemoved: number = extractIdFromCardName(input);
      const updatedPresetObj: Preset = removeCardIdFromPresetObj(cardIdToBeRemoved, presetObj);
      writePresetObjToDisk(presetName, updatedPresetObj);
      return preset__removeCard(presetName);
    }
  );
};
