import fs from 'fs';
import { TEXTCOLOR } from "./src/constants.js";
import { getAllPresets, renderHr } from "./src/utils.js";
import { getCardList } from './src/cards.js';

const args = process.argv.slice(2);

const getNameWithId = (cardIdentifier, cardList) => {
  const card = cardList.find(c => c.identifier === cardIdentifier);
  if(card){
    return `[${card.id}]${card.title}`;
  }
  return ''
}

const run = () => {
  if(!args[0]){
    console.info(`${TEXTCOLOR.RED}Please provide preset ID.${TEXTCOLOR.DEFAULT}`)
    return;
  }

  const allPresets = getAllPresets();
  const presetId = args[0];
  const selectedPresetName = allPresets.find(p => p.split('.')[0] === presetId);

  if(!selectedPresetName){
    console.info(`${TEXTCOLOR.RED}Cannot find preset with ID of ${presetId}${TEXTCOLOR.DEFAULT}`)
    return;
  }

  const presetFileContent = fs.readFileSync(`./.presets/${selectedPresetName}`);
  const presetObject = JSON.parse(presetFileContent);

  const allCards = getCardList();

  console.info(`
  PRESET DETAILS:

  NAME: ${TEXTCOLOR.GREEN}${selectedPresetName}${TEXTCOLOR.DEFAULT}

  GOLD: ${TEXTCOLOR.GREEN}${100}${TEXTCOLOR.DEFAULT} 

  RELICS: ${TEXTCOLOR.GREEN}${presetObject.relics.join(', ')}${TEXTCOLOR.DEFAULT}
  
  CARDS: ${TEXTCOLOR.GREEN}${presetObject.cards.map(cname=>getNameWithId(cname, allCards)).join(', ')}${TEXTCOLOR.DEFAULT}
  `);
  renderHr();
}

run();