import fs from 'fs';
import { PRESET_FOLDER_NAME } from "../constants.js";
import { Preset } from '../types.js';

export class PresetService {
  private readAllPresetNamesFromDisk(){
    // If preset folder not exists, then return empty array, and create the folder
    if(!fs.existsSync(`./${PRESET_FOLDER_NAME}`)) {
      fs.mkdirSync(`./${PRESET_FOLDER_NAME}`);
      return [];
    }

    // At this point, preset folder exists, so read the files
    const files = fs.readdirSync(`./${PRESET_FOLDER_NAME}`);
    
    // Sort the filename correctly
    const sorted = files.sort((a, b) => {
      const aNumber = parseInt(a.split('.')[0]);
      const bNumber = parseInt(b.split('.')[0]);
      return aNumber - bNumber;
    });

    return sorted;
  }

  public getAllPresets () {
    const files = this.readAllPresetNamesFromDisk();
    return files;
  }
}