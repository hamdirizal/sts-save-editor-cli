import tk from 'terminal-kit';
import { renderHeader } from '../utils.js';
import { ListOption } from '../types.js';
import { preset__single } from './preset__single.js';
import { deletePresetFromDisk } from '../helpers/preset-helper.js';
import { preset__management } from './preset__management.js';

const term = tk.terminal;

export const preset__deleteConfirm = (presetName: string) => {
  renderHeader();
  term.cyan(`Are you sure want to delete "${presetName}"?\n`);

  const choices: ListOption[] = [
    { value: 'no', name: 'No. Go back to the preset page' },
    { value: 'yes', name: 'Yes. Permanently delete this preset. ' },
  ];

  term.singleColumnMenu(
    choices.map((c) => c.name),
    { cancelable: true },
    (error, response) => {
      if (response.canceled) {
        return preset__single(presetName);
      }
      if (choices[response.selectedIndex].value === 'yes') {
        const success: boolean = deletePresetFromDisk(presetName);
        if (success) return preset__management();
      }
      return preset__single(presetName);
    }
  );
};
