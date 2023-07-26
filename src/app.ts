import { createPresetFolderIfNotExists } from './helpers/preset-helper.js';
import { home } from './screens/home.js';
import { readAppDataFromDisk } from './utils.js';

createPresetFolderIfNotExists();
readAppDataFromDisk();
home();
