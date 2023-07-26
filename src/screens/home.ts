import tk from 'terminal-kit';
import { renderHeader } from '../utils.js';
import exit from './exit.js';
import { preset__management } from './preset__management.js';
import { ListOption } from '../types.js';
const term = tk.terminal;

export const home = () => {
  renderHeader();
  term.cyan('What do you want to do?\n');

  const choices: ListOption[] = [
    { value: 'manage_presets', name: 'Manage presets ' },
    { value: 'exit', name: 'Exit ' },
  ];

  term.singleColumnMenu(
    choices.map((c) => c.name),
    { cancelable: true },
    (error, response) => {
      if (response.canceled) {
        return exit();
      }
      if (choices[response.selectedIndex].value === 'manage_presets') {
        return preset__management();
      }
      return exit();
    }
  );
};
