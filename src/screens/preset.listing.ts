import { getAllPresetNames } from '../helpers/preset-helpers.js';
import { ListOption } from '../types.js';
import { renderHeader } from '../utils.js';
import tk from 'terminal-kit';
const term = tk.terminal;

export default () => {
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
        // this.showScreen__home(null);
        return;
      }
      const obj = choices[response.selectedIndex];
      if (obj.value === 'open_preset') {
        // this.showScreen__presetSelection();
      } else if (obj.value === 'create_preset') {
        // this.showScreen__presetNameInput();
      } else {
        // this.showScreen__home(null);
      }
    }
  );

  return;
};
