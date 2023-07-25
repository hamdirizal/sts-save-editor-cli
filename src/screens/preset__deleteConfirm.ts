import tk from 'terminal-kit';
import { renderArrayAsGrid2, renderHeader, searchArray } from '../utils.js';
import { GameRelic, ListOption, Preset } from '../types.js';
import { preset__single } from './preset__single.js';
import { extractIdFromRelicName, getAllRelics, getRelicNameById } from '../helpers/relic-helper.js';
import {
  getPresetDataByFilename,
  removeRelicIdFromPresetObj,
  writePresetObjToDisk,
} from '../helpers/preset-helper.js';

const term = tk.terminal;

export const preset__deleteConfirm = (presetName: string) => {};
