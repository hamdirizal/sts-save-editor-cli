import tk from 'terminal-kit';
import { renderHeader } from '../utils.js';

const term = tk.terminal;

export const preset__single = (presetName: string) => {
  renderHeader();
  console.log('presetName to be opened', presetName);
  process.exit();
}