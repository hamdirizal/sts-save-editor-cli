import fs from 'fs';
import { PRESET_FOLDER_NAME } from "../constants.js";
import { Preset } from '../types.js';

export class PresetService {

  private defaultPresetContent: Preset = {gold: 99, cards: [], relics: []}

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

  private readOnePresetFromDisk(filename: string): any {
    const fileContent = fs.readFileSync(`./${PRESET_FOLDER_NAME}/${filename}`, 'utf8');
    return JSON.parse(fileContent);
  }

  public getAllPresets () {
    const files = this.readAllPresetNamesFromDisk();
    return files;
  }

  public getLastPresetId() {
    const allPresets = this.getAllPresets();
    if(allPresets.length === 0) {
      return 0;
    }
    else {
      const lastPresetName = allPresets[allPresets.length-1];
      const lastNumber = lastPresetName.split('.')[0];
      return parseInt(lastNumber);
    }
  }

  public generatePresetName(rawName: string) {
    const allowedCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
    let newName = rawName;
  
    // Make uppercase
    newName = newName.trim().toUpperCase();
  
    // Spaces with underscores
    newName = newName.replace(/ /g, '_');
  
    // Remove non-allowed characters
    newName = newName.split('').filter(c => allowedCharacters.includes(c)).join('');
  
    const lastPresetId = this.getLastPresetId();
    const finalName = `${lastPresetId+1}.${newName}.json`;
    
    // Return final name
    return finalName;
  }

  public getPresetNameById (id: number): string {
    const filenames = this.getAllPresets();
    if(filenames.length === 0) {
      return null;
    }
    const filename = filenames.find(f => parseInt(f.split('.')[0]) === id);
    if(!filename) {
      return null;
    }

    return filename;
  }

  public getPresetDataByFilename (filename: string): Preset {
    return this.readOnePresetFromDisk(filename);
  }

  public writePresetToDisk(presetName: string, content: Preset){}

  public writeDefaultPresetToDisk (presetName: string) {
    fs.writeFileSync(`./${PRESET_FOLDER_NAME}/${presetName}`, JSON.stringify(this.defaultPresetContent));
  }
}