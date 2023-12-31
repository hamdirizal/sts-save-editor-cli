import tk from 'terminal-kit';
import { renderArrayAsGrid2, renderHeader } from '../utils.js';
import { getPresetDataByFilename } from '../helpers/preset-helper.js';
import { ListOption, Preset } from '../types.js';
import { preset__management } from './preset__management.js';
import { getAllCards, getCardNameById } from '../helpers/card-helper.js';
import { preset__addCard } from './preset__addCard.js';
import { preset__removeCard } from './preset__removeCard.js';
import { preset__addRelic } from './preset__addRelic.js';
import { getAllRelics, getRelicNameById } from '../helpers/relic-helper.js';
import { preset__removeRelic } from './preset__removeRelic.js';
import { preset__setGold } from './preset__setGold.js';
import { preset__deleteConfirm } from './preset__deleteConfirm.js';
import { preset__inject__inputSaveFilePath } from './preset__inject__inputSaveFilePath.js';

const term = tk.terminal;

export const preset__single = (presetName: string) => {
  renderHeader();

  const presetObj: Preset | null = getPresetDataByFilename(presetName);

  const allCards = getAllCards();

  const allRelics = getAllRelics();

  const cardNamesInThisPreset: string[] = presetObj.cards
    .map((id) => {
      return getCardNameById(id, allCards);
    })
    .filter((name) => name !== '');

  const relicNamesInThisPreset: string[] = presetObj.relics
    .map((id) => {
      return getRelicNameById(id, allRelics);
    })
    .filter((name) => name !== '');

  term.cyan('Preset: ');
  term(presetName + '\n\n');
  term.cyan('Gold: ');
  term(presetObj.gold + '\n\n');
  term.cyan(`Cards (${cardNamesInThisPreset.length}): \n`);
  renderArrayAsGrid2(cardNamesInThisPreset, 120);
  term('\n');
  term.cyan(`Relics (${relicNamesInThisPreset.length}): \n`);
  renderArrayAsGrid2(relicNamesInThisPreset, 120);
  term('\n');
  term.cyan('What do you want to do with this preset?');

  const choices: ListOption[] = [
    { name: 'Add card', value: 'add_card' },
    { name: 'Remove card', value: 'remove_card' },
    { name: 'Add relic', value: 'add_relic' },
    { name: 'Remove relic', value: 'remove_relic' },
    { name: 'Set gold amount', value: 'set_gold' },
    { name: 'Inject this preset to a save file', value: 'inject_preset' },
    { name: 'Delete this preset', value: 'delete_preset' },
    { name: 'Back to the preset list', value: 'back' },
  ];

  term.singleColumnMenu(
    choices.map((c) => c.name),
    { cancelable: true },
    (error, response) => {
      if (response?.canceled) {
        return preset__management();
      }
      if (choices[response.selectedIndex].value === 'inject_preset') {
        return preset__inject__inputSaveFilePath(presetName, '');
      } else if (choices[response.selectedIndex].value === 'add_card') {
        return preset__addCard(presetName);
      } else if (choices[response.selectedIndex].value === 'remove_card') {
        return preset__removeCard(presetName);
      } else if (choices[response.selectedIndex].value === 'add_relic') {
        return preset__addRelic(presetName);
      } else if (choices[response.selectedIndex].value === 'remove_relic') {
        return preset__removeRelic(presetName);
      } else if (choices[response.selectedIndex].value === 'set_gold') {
        return preset__setGold(presetName);
      } else if (choices[response.selectedIndex].value === 'delete_preset') {
        return preset__deleteConfirm(presetName);
      } else {
        return preset__management();
      }
    }
  );
};
