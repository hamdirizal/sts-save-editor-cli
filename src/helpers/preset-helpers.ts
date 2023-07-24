import fs from 'fs';
import { PRESET_FOLDER_NAME } from '../constants.js';
import { Preset } from '../types.js';

const DEFAULT_PRESET_CONTENT: Preset = { gold: 99, cards: [], relics: [] };

export const createPresetFolderIfNotExists = () => {
  if (!fs.existsSync(`./${PRESET_FOLDER_NAME}`)) {
    fs.mkdirSync(`./${PRESET_FOLDER_NAME}`);
  }
}

export const getAllPresetNames = (): string[] => {
  return ['preset1', 'preset2', 'preset3'];
};

export const sanitizePresetName = (rawName: string): string => {
  const allowedCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';

  let newName = rawName;

  // Make uppercase
  newName = newName.trim().toUpperCase();

  // Spaces with underscores
  newName = newName.replace(/ /g, '_');

  // Remove non-allowed characters
  newName = newName
    .split('')
    .filter((c) => allowedCharacters.includes(c))
    .join('');

  if (newName.length === 0) {
    return '';
  }

  const allPresetNames: string[] = getAllPresetNames();

  // If preset name already exists, then return empty string
  if (allPresetNames.find((p) => p.split('.')[1] === newName)) {
    return '';
  }

  // Return final name
  return newName;
};

export const createDefaultPresetOnDisk = (presetName: string) => {
  fs.writeFileSync(`./${PRESET_FOLDER_NAME}/${presetName}`, JSON.stringify(DEFAULT_PRESET_CONTENT));
};
