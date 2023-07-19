import fs from 'fs';
import { encodePresetName, getDefaultPresetContent } from "./src/utils.js";
import { TEXTCOLOR } from './src/constants.js';

const args = process.argv.slice(2);

const run = () => {
  if(args.length === 0) {
    console.info(`${TEXTCOLOR.RED}Please provide name for the preset.${TEXTCOLOR.DEFAULT}`);
    return;
  }

  // Create preset name
  const encodedName = encodePresetName(args.join(' '));

  // Create empty preset file
  fs.writeFileSync(`./.presets/${encodedName}`, JSON.stringify(getDefaultPresetContent()));
  console.info(`${TEXTCOLOR.GREEN}Preset "${encodedName}" created.${TEXTCOLOR.DEFAULT}`);
  return;

}

run();

