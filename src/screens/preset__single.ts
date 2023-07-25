import tk from 'terminal-kit';
import { renderArrayAsGrid2, renderHeader } from '../utils.js';
import { getPresetDataByFilename } from '../helpers/preset-helper.js';
import { ListOption, Preset } from '../types.js';
import { preset__management } from './preset__management.js';
import { getAllCards, getCardNameById } from '../helpers/card-helper.js';
import { preset__addCard } from './preset__addCard.js';
import { preset__removeCard } from './preset__removeCard.js';

const term = tk.terminal;

export const preset__single = (presetName: string) => {
  renderHeader();

  const presetObj: Preset | null = getPresetDataByFilename(presetName);

  const allCards = getAllCards();

  const cardNamesInThisPreset: string[] = presetObj.cards
    .map((id) => {
      return getCardNameById(id, allCards);
    })
    .filter((name) => name !== '');

  term.cyan('Preset name: ');
  term(presetName + '\n\n');
  term.cyan('Gold: ');
  term(presetObj.gold + '\n\n');
  term.cyan(`Cards (${cardNamesInThisPreset.length}): \n`);
  renderArrayAsGrid2(cardNamesInThisPreset, 120);
  term('\n');
  term.cyan('Relics: \n');
  // term(this.relicService.transformIdsToReadableNames(presetObj.relics).join('  ') + '\n\n');
  term('\n');
  term.cyan('What do you want to do with this preset?');

  const choices: ListOption[] = [
    { name: 'Inject this preset to a save file', value: 'inject_preset' },
    { name: 'Add card', value: 'add_card' },
    { name: 'Remove card', value: 'remove_card' },
    { name: 'Add relic', value: 'add_relic' },
    { name: 'Remove relic', value: 'remove_relic' },
    { name: 'Set gold amount', value: 'set_gold' },
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
        process.exit();
        // this.showScreen__inputSaveFilePath(presetName, null);
      } else if (choices[response.selectedIndex].value === 'add_card') {
        return preset__addCard(presetName);
      } else if (choices[response.selectedIndex].value === 'remove_card') {
        return preset__removeCard(presetName);
      } else {
        return preset__management();
      }
    }
  );
};
