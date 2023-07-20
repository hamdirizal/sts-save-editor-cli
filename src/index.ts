import inquirer from 'inquirer';
import { readAppState, renderAppHeader, renderArrayAsGrid, renderHr, writeAppState } from './utils.js';
import { AppState, Card } from './types.js';
import fs, { existsSync } from 'fs';
import { getCardList } from './cards.js';
import { viewCardsPage } from './pages/viewCardsPage.js';
import { MyApp } from './MyApp.js';
import { InitialPage } from './InitialPage.js';
import { Utility } from './Utility.js';
import { CardService } from './CardService.js';
import { CardsPage } from './CardsPage.js';
import { Page } from './Page.js';


const utility: Utility = new Utility();
const page: Page = new Page(utility);
// const cardService: CardService = new CardService();
// const cardsPage: CardsPage = new CardsPage(utility, cardService);
// const initialPage: InitialPage = new InitialPage(utility, cardsPage);


// initialPage.setCloseFunc(() => { console.log('closing')});

// initialPage.run();
page.showHomePage();

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

const homePagex = () => {
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
        // viewCardsPage(homePage());
      }
      else{
        console.log('done');
      }
    });
}

const main = () => {  
  const appState:AppState = readAppState();
  // homePage();
  // if(appState.gameSavePath) {
  //   console.log("Save path:", appState.gameSavePath);
  // }
  // else{
  //   noSavePath();
  // }  
}

// main();