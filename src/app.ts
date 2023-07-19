import inquirer from 'inquirer';
import { readAppState, writeAppState } from './utils.js';
import { AppState } from './types.js';
import fs, { existsSync } from 'fs';
import { getCardList } from './cards.js';

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

const viewCardsPage = () => {}

const homePage = () => {
  console.info('What do you want to do?');
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'Pick one',
      choices: [
        {value: 'view_cards', name: 'View all cards'},
        {value: 'view_relics', name: 'View all relics'},
        {value: 'presets', name: 'View presets'},
        {value: 'inject_save_file', name: 'Inject preset to a save file'},
      ],
    })
    .then((answers) => {
      console.log(answers);
    });
}

const main = () => {  
  const appState:AppState = readAppState();
  homePage();
  // if(appState.gameSavePath) {
  //   console.log("Save path:", appState.gameSavePath);
  // }
  // else{
  //   noSavePath();
  // }  
}

main();