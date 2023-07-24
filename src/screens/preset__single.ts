import tk from 'terminal-kit';
import { renderArrayAsGrid2, renderHeader } from '../utils.js';
import { getPresetDataByFilename } from '../helpers/preset-helpers.js';
import { ListOption, Preset } from '../types.js';
import { preset__management } from './preset__management.js';

const term = tk.terminal;

export const preset__single = (presetName: string) => {
  renderHeader();

  const presetObj: Preset | null = getPresetDataByFilename(presetName);

  const cardNames: string[] = ['foo', 'bar', 'baz'];

  term.cyan('Preset name: ');
  term(presetName + '\n\n');
  term.cyan('Gold: ');
  term(presetObj.gold + '\n\n');
  term.cyan(`Cards (${cardNames.length}): \n`);
  renderArrayAsGrid2(cardNames, 120);
  term('\n');
  term.cyan('Relics: \n');
  // term(this.relicService.transformIdsToReadableNames(presetObj.relics).join('  ') + '\n\n');
  term('\n');
  term.cyan('What do you want to do with this preset?');

  const choices: ListOption[] = [
    { name: 'Inject this preset to a save file', value: 'inject_preset' },
    { name: 'Add cards', value: 'add_cards' },
    { name: 'Remove cards', value: 'remove_cards' },
    { name: 'Add relics', value: 'add_relics' },
    { name: 'Remove relics', value: 'remove_relics' },
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
      } else if (choices[response.selectedIndex].value === 'add_cards') {
        process.exit();
        // this.showScreen__addCardsToPreset(presetName);
      } else if (choices[response.selectedIndex].value === 'create_preset') {
        process.exit();
        // this.showScreen__presetNameInput();
      } else {
        return preset__management();
      }
    }
  );
};
