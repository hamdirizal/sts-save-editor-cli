import tk from 'terminal-kit';
import { renderHeader } from '../utils.js';
import { ListOption } from '../types.js';
import { preset__management } from './preset__management.js';
import { preset__add__inputName } from './preset__add__inputName.js';
import { createDefaultPresetOnDisk } from '../helpers/preset-helpers.js';

const term = tk.terminal;

export const preset__add__confirmName = (newPresetName: string) => {
  renderHeader();
  term.cyan('You are going to create a preset called ');
  term.yellow(`"${newPresetName}", `);
  term.cyan('are you sure?\n');

  const choices: ListOption[] = [
    { value: 'yes_confirm', name: 'Yes, create the preset ' },
    { value: 'change_name', name: 'No, change name ' },
    { value: 'cancel', name: 'Cancel, Back to the preset management ' },
  ];

  term.singleColumnMenu(
    choices.map((c) => c.name),
    { cancelable: true },
    (error, response) => {
      if (response?.canceled) {
        return preset__management();
      }
      if (choices[response.selectedIndex].value === 'yes_confirm') {
        createDefaultPresetOnDisk(newPresetName);
        return preset__management();
      } else if (choices[response.selectedIndex].value === 'change_name') {
        return preset__add__inputName();
      } else {
        return preset__management();
      }
    }
  );
};
