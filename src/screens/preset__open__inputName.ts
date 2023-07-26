import tk from 'terminal-kit';
import { renderArrayAsGrid2, renderHeader, searchArray } from '../utils.js';
import { getAllPresetNames } from '../helpers/preset-helper.js';
import { preset__management } from './preset__management.js';
import { preset__single } from './preset__single.js';

const term = tk.terminal;

export const preset__open__inputName = () => {
  renderHeader();
  const allPresetNames: string[] = getAllPresetNames();
  term.cyan('All presets: \n');
  renderArrayAsGrid2(allPresetNames, 120);
  term('\n');
  term.cyan('Please type preset name to be opened. \n');
  term.cyan('<TAB> to autocomplete. <ENTER> to confirm. <ESC> to go back.\n');
  term.inputField(
    {
      autoComplete: (input) => searchArray(input, allPresetNames),
      autoCompleteMenu: true,
      autoCompleteHint: false,
      cancelable: true,
    },
    (error, input) => {
      const isCanceled = input === undefined;
      if (isCanceled) {
        return preset__management();
      }
      const isEmpty = input.trim() === '';
      if (isEmpty) {
        return preset__management();
      }
      const isPresetAvailable = allPresetNames.indexOf(input) >= 0;
      if (!isPresetAvailable) {
        return preset__open__inputName();
      }
      return preset__single(input);
    }
  );
};
