import fs from 'fs';
import { getAllPresets, renderHr } from './src/utils.js';
import { TEXTCOLOR } from './src/constants.js';

const run = () => {
  const allPresets = getAllPresets();

  if (allPresets.length === 0) {
    console.info(`${TEXTCOLOR.RED}No presets found. Please create one first.${TEXTCOLOR.DEFAULT}`);
    return;
  }
  console.info(`\n${TEXTCOLOR.GREEN}ALL PRESETS:${TEXTCOLOR.DEFAULT}`)
  console.info(allPresets.join("\n"));
  renderHr();
  return;
}

run();