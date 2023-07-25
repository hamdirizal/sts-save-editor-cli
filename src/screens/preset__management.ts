import tk from 'terminal-kit';
import { getAllPresetNames } from '../helpers/preset-helper.js';
import { ListOption } from '../types.js';
import { renderHeader } from '../utils.js';
import home from './home.js';
import { preset__add__inputName } from './preset__add__inputName.js';
import { preset__open__inputName } from './preset__open__inputName.js';

const term = tk.terminal;

export const preset__management = () => {
  renderHeader();
  const presetNames: string[] = getAllPresetNames();
  term.cyan('Presets Management\n');
  const choices: ListOption[] = [];
  if (presetNames.length) choices.push({ name: 'Open preset', value: 'open_preset' });
  choices.push({ name: 'Create new preset', value: 'create_preset' });
  choices.push({ name: 'Back to the main page', value: 'back' });

  term.singleColumnMenu(
    choices.map((o) => o.name),
    { cancelable: true },
    (error, response) => {
      if (response?.canceled) {
        return home();
      }
      const obj = choices[response.selectedIndex];
      if (obj.value === 'open_preset') {
        return preset__open__inputName();
      } else if (obj.value === 'create_preset') {
        return preset__add__inputName();
      } else {
        return home();
      }
    }
  );
};
