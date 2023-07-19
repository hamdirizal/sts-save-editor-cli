import inquirer from 'inquirer';
import { readAppState, writeAppState } from './utils.js';
import { AppState } from './types.js';
import fs, { existsSync } from 'fs';

const processTheGivenSavePath = (savePath) => {
  if(existsSync(savePath)) {
    const appState:AppState = readAppState();
    writeAppState({
      ...appState,
      gameSavePath: savePath
    });
    console.log('Directory exists')
  }
  else {
    console.log('Directory does not exist');
  }
  

}

const noSavePath = () => {
  inquirer
    .prompt({
      type: 'input',
      name: 'save_path',
      message: 'Please enter the path where the save file exists',
    })
    .then((answers) => {
      processTheGivenSavePath(answers.save_path);
    });
}

const noSaveFile = () => {
  inquirer
    .prompt({
      type: 'input',
      name: 'save_path',
      message: 'Please enter the path where the save file exists',
    })
    .then(() => {
      console.log('The wolf mauls you. You die. The end.');
    });
}

const success = () => {}

const main = () => {  
  const appState:AppState = readAppState();
  if(appState.gameSavePath) {
    console.log("Save path:", appState.gameSavePath);
  }
  else{
    noSavePath();
  }
  
}

main();