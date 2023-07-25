import fs from 'fs';
import { PRESET_FOLDER_NAME } from '../constants.js';
import { Preset, PresetSchema } from '../types.js';

const DEFAULT_PRESET_CONTENT: Preset = { gold: 99, cards: [], relics: [] };

export const createPresetFolderIfNotExists = () => {
  if (!fs.existsSync(`./${PRESET_FOLDER_NAME}`)) {
    fs.mkdirSync(`./${PRESET_FOLDER_NAME}`);
  }
};

export const getAllPresetNames = (): string[] => {
  // If preset folder not exists, then return empty array, and create the folder
  if (!fs.existsSync(`./${PRESET_FOLDER_NAME}`)) {
    fs.mkdirSync(`./${PRESET_FOLDER_NAME}`);
    return [];
  }

  // At this point, preset folder exists, so read the files
  return fs.readdirSync(`./${PRESET_FOLDER_NAME}`);
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

export const writePresetObjToDisk = (presetName: string, presetObj: Preset) => {
  fs.writeFileSync(`./${PRESET_FOLDER_NAME}/${presetName}`, JSON.stringify(presetObj));
};

export const getPresetDataByFilename = (filename: string): Preset | null => {
  let fileContent: string;
  try {
    fileContent = fs.readFileSync(`./${PRESET_FOLDER_NAME}/${filename}`, 'utf8');
  } catch (error) {
    return null;
  }
  let presetObj: Preset;
  try {
    presetObj = JSON.parse(fileContent);
  } catch (error) {
    return null;
  }
  if (!PresetSchema.safeParse(presetObj).success) {
    return null;
  }

  // Order cards by name
  presetObj.cards = presetObj.cards.sort((a, b) => a - b);

  return presetObj;
};

export const addCardIdToPresetObj = (cardId: number, presetObj: Preset): Preset => {
  return { ...presetObj, cards: [...presetObj.cards, cardId] };
};

export const removeCardIdFromPresetObj = (cardId: number, presetObj: Preset): Preset => {
  const foundIndex: number = presetObj.cards.indexOf(cardId);
  presetObj.cards.splice(foundIndex, 1);
  return { ...presetObj, cards: presetObj.cards };
};
