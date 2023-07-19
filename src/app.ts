import inquirer from 'inquirer';
import { readAppState, renderAppHeader, renderArrayAsGrid, renderHr, writeAppState } from './utils.js';
import { AppState, Card } from './types.js';
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

const viewCardsPage = () => {
  renderAppHeader();
  console.info('All available cards');
  const cards: Card[] = getCardList();
  console.info(renderArrayAsGrid(cards.map(c=>`[${c.id}] ${c.title}`), 24, 5));
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'Back to main page?',
      choices: [
        {value: 'ok', name: 'OK'},
      ],
    })
    .then((answers) => {
      homePage();
    });
}

const homePage = () => {
  renderAppHeader();
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        {value: 'view_cards', name: 'View all cards'},
        {value: 'view_relics', name: 'View all relics'},
        {value: 'presets', name: 'View presets'},
        {value: 'inject_save_file', name: 'Inject preset to a save file'},
        {value: 'exit', name: 'Exit'},
      ],
    })
    .then((answers) => {
      if(answers.action === 'view_cards') {
        viewCardsPage();
      }
      else{
        console.log('done');
      }
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