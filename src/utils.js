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

export const encodePresetName = (presetName) => {
  const allowedCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
  let newName = '';

  // Make uppercase
  newName = presetName.toUpperCase();

  // Spaces with underscores
  newName = presetName.replace(/ /g, '_');

  // Remove non-allowed characters
  newName = newName.split('').filter(c => allowedCharacters.includes(c)).join('');
  
  // Return final name
  return ``;
}

export const createPresetsFolderIfNotExists = () => {
  if(!fs.existsSync('./.presets')) {
    fs.mkdirSync('./.presets');
  }
}