import fs from 'fs';
import { TEXTCOLOR } from "./src/constants.js";
import { getAllPresets, renderHr } from "./src/utils.js";
import { getCardList } from './src/cards.js';

const args = process.argv.slice(2);

const run = () => {
  if(!args[0]){
    console.info(`${TEXTCOLOR.RED}Please provide a preset ID.${TEXTCOLOR.DEFAULT}`)
    return;
  }

  const allPresets = getAllPresets();
  const presetId = args[0];
  const selectedPresetName = allPresets.find(p => p.split('.')[0] === presetId);

  if(!selectedPresetName){
    console.info(`${TEXTCOLOR.RED}Cannot find preset with ID of ${presetId}${TEXTCOLOR.DEFAULT}`)
    return;
  }

  const cardIds = process.argv.slice(3);
  if(!cardIds.length){
    console.info(`${TEXTCOLOR.RED}Please provide at least one card ID to be added${TEXTCOLOR.DEFAULT}`)
    return;
  }

  const presetFileContent = fs.readFileSync(`./.presets/${selectedPresetName}`);
  const presetObject = JSON.parse(presetFileContent);

  const cardList = getCardList();
  cardIds.forEach(cardId => {
    const card = cardList.find(c => c.id === parseInt(cardId));
    if(card){
      console.info(`Adding ${TEXTCOLOR.GREEN}${card.title}${TEXTCOLOR.DEFAULT} to preset ${TEXTCOLOR.GREEN}${selectedPresetName}${TEXTCOLOR.DEFAULT}`);
      presetObject.cards.push(card.identifier);
    }
  });

  // Write to file
  fs.writeFileSync(`./.presets/${selectedPresetName}`, JSON.stringify(presetObject));

}

run();