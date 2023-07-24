import tk from 'terminal-kit';
import { renderArrayAsGrid2, renderHeader, searchArray } from '../utils.js';
import { getAllPresetNames } from '../helpers/preset-helpers.js';
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
      if (input === undefined) {
        return preset__management();
      }
      // If input is falsy, reload the screen
      if (!input || !input.trim()) {
        return preset__management();
      }
      // If input is truthy, but the preset not on the list, reload the screen
      if (allPresetNames.indexOf(input) === -1) {
        return preset__open__inputName();
      }

      // At this point, the process is valid, go to the preset details page
      return preset__single(input);
    }
  );
};
