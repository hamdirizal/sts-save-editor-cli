import tk from 'terminal-kit';
import { renderHeader } from '../utils.js';
import { ListOption } from '../types.js';
import { preset__single } from './preset__single.js';
const term = tk.terminal;

export const preset__inject__success = (presetName: string) => {
  renderHeader();
  term.cyan(`${presetName} has been injected successfully.\n`);

  const choices: ListOption[] = [{ value: 'ok', name: 'Cool. Back to the preset page.' }];

  term.singleColumnMenu(
    choices.map((c) => c.name),
    {},
    (error, response) => {
      return preset__single(presetName);
    }
  );
};
