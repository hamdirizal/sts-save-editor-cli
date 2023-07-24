import tk from 'terminal-kit';
import { renderHeader } from '../utils.js';
import exit from './exit.js';
import presetListing from './preset.listing.js';
import { ListOption } from '../types.js';
const term = tk.terminal;

export default () => {
  renderHeader();
  term.cyan('What do you want to do?\n');

  const choices: ListOption[] = [
    { value: 'manage_presets', name: 'Manage presets ' },
    { value: 'view_cards', name: 'View cards ' },
    { value: 'view_relics', name: 'View relics ' },
    { value: 'exit', name: 'Exit ' },
  ];
  var items = ['Manage presets ', 'View cards ', 'View relics ', 'Exit '];

  term.singleColumnMenu(
    choices.map((c) => c.name),
    { cancelable: true },
    (error, response) => {
      if (response.canceled) {
        return exit();
      }
      if (choices[response.selectedIndex].value === 'manage_presets') {
        return presetListing();
      } else if (response.selectedIndex === 1) {
        // this.showScreen__cardList();
      } else if (response.selectedIndex === 2) {
        // this.showScreen__relicList();
      } else {
        // this.showScreen__exit();
      }
      process.exit();
    }
  );
};
