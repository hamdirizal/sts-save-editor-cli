import fs from 'fs';

export const renderHr = () => {
  console.info('_'.repeat(120))
}

export const displayAsGrid = (stringArray, colWidth, numberOfCols) => {
  let result = '';
  let col = 0;
  for (let i = 0; i < stringArray.length; i++) {
    if (col === numberOfCols) {
      result += '\n';
      col = 0;
    }
    result += stringArray[i].padEnd(colWidth, ' ');
    col++;
  }
  console.info(result)
}

const getLastPresetId = () => {
  const allPresets = getAllPresets();
  if(allPresets.length === 0) {
    return 0;
  }
  else {
    const lastPresetName = allPresets[allPresets.length-1];
    const lastNumber = lastPresetName.split('.')[0];
    return parseInt(lastNumber);
  }
}

export const encodePresetName = (presetName) => {
  const allowedCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
  let newName = presetName;

  // Make uppercase
  newName = newName.toUpperCase();

  // Spaces with underscores
  newName = newName.replace(/ /g, '_');

  // Remove non-allowed characters
  newName = newName.split('').filter(c => allowedCharacters.includes(c)).join('');

  const lastPresetId = getLastPresetId();
  const finalName = `${lastPresetId+1}.${newName}.json`;
  
  // Return final name
  return finalName;
}

export const createPresetsFolderIfNotExists = () => {
  if(!fs.existsSync('./.presets')) {
    fs.mkdirSync('./.presets');
  }
}

export const getAllPresets = () => {
  createPresetsFolderIfNotExists();
  const files = fs.readdirSync('./.presets');

  // Order filename correctly
  files.sort((a, b) => {
    const aNumber = parseInt(a.split('.')[0]);
    const bNumber = parseInt(b.split('.')[0]);
    return aNumber - bNumber;
  });

  return files;
}

export const getDefaultPresetContent = () => {
  return {
    gold: 99,
    cards: [],
    relics: [],
  }
}