import tk from 'terminal-kit';
import { renderArrayAsGrid2, renderHeader, searchArray } from '../utils.js';
import { GameCard, ListOption, Preset } from '../types.js';
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
      //If cancelled, return to the preset management page
      if (input === undefined) {
        return preset__single(presetName);
      }
      // If input is empty, loop back to this page
      if (!input.trim()) {
        return preset__addCard(presetName);
      }

      // Input must available in the cardnames
      if (allCardNames.indexOf(input) === -1) {
        return preset__addCard(presetName);
      }

      // Otherwise, card is valid,
      // Push the card id to the preset, then loop back to this page
      const cardId: number = extractIdFromCardName(input);
      const updatedPresetObj: Preset = addCardIdToPresetObj(cardId, presetObj);
      writePresetObjToDisk(presetName, updatedPresetObj);
      return preset__addCard(presetName);
    }
  );
};
