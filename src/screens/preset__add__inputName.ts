import tk from 'terminal-kit';
import { preset__management } from './preset__management.js';
import { sanitizePresetName } from '../helpers/preset-helper.js';
import { preset__add__confirmName } from './preset__add__confirmName.js';
import { renderHeader } from '../utils.js';

const term = tk.terminal;

export const preset__add__inputName = () => {
  renderHeader();
  term.cyan('Enter name for the new preset: ');
  term.inputField({ autoCompleteMenu: false, cancelable: true }, (error, input) => {
    const isCanceled = input === undefined;
    if (isCanceled) {
      return preset__management();
    }
    const isInputEmpty = input.trim() === '';
    if (isInputEmpty) {
      return preset__add__inputName();
    }
    const sanitizedName = sanitizePresetName(input);
    if (!sanitizedName) {
      return preset__add__inputName();
    }
    return preset__add__confirmName(sanitizedName);
  });
};
