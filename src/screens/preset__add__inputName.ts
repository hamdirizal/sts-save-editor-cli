import tk from 'terminal-kit';
import { preset__management } from './preset__management.js';
import { sanitizePresetName } from '../helpers/preset-helper.js';
import { preset__add__confirmName } from './preset__add__confirmName.js';
import { renderHeader } from '../utils.js';

const term = tk.terminal;

export const preset__add__inputName = () => {
  renderHeader();
  term.cyan('Enter a name for the new preset: ');
  term.inputField({ autoCompleteMenu: false, cancelable: true }, (error, input) => {
    //If cancelled, return to the preset management page
    if (input === undefined) {
      return preset__management();
    }
    // If input is empty, loop back to this page
    if (!input.trim()) {
      return preset__add__inputName();
    }
    const generatedName = sanitizePresetName(input);
    // If failed to generate name, also loop back to this page
    if (!generatedName) {
      return preset__add__inputName();
    }

    // Otherwise, name is valid, go to the name confirmation page
    return preset__add__confirmName(generatedName);
  });
};
