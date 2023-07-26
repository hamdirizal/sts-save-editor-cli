import tk from 'terminal-kit';
import { renderArrayAsGrid2, renderHeader, searchArray } from '../utils.js';
import { GameCard, Preset } from '../types.js';
import { preset__single } from './preset__single.js';
import { extractIdFromCardName, getAllCards, getCardNameById } from '../helpers/card-helper.js';
import {
  addCardIdToPresetObj,
  getPresetDataByFilename,
  writePresetObjToDisk,
} from '../helpers/preset-helper.js';

const term = tk.terminal;

export const preset__addCard = (presetName: string) => {
  const allCards: GameCard[] = getAllCards();
  const allCardNames: string[] = allCards.map((c) => c.title);
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
    'Enter card name to be added to this preset. \n<ENTER> to confirm. <TAB> to autocomplete. <ESC> to go back.\n'
  );
  term.inputField(
    {
      autoComplete: (input) => searchArray(input, allCardNames),
      autoCompleteMenu: true,
      autoCompleteHint: false,
      cancelable: true,
    },
    (error, input) => {
      const isCanceled = input === undefined;
      if (isCanceled) {
        return preset__single(presetName);
      }
      const isInputEmpty = input.trim() === '';
      if (isInputEmpty) {
        return preset__addCard(presetName);
      }
      const isCardNameAvailable = allCardNames.indexOf(input) >= 0;
      if (!isCardNameAvailable) {
        return preset__addCard(presetName);
      }
      const cardIdToBeAdded: number = extractIdFromCardName(input);
      const updatedPresetObj: Preset = addCardIdToPresetObj(cardIdToBeAdded, presetObj);
      writePresetObjToDisk(presetName, updatedPresetObj);
      return preset__addCard(presetName);
    }
  );
};
