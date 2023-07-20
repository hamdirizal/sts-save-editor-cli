import { MyApp } from "../MyApp.js";
import inquirer from 'inquirer';
import { Utility } from "../Utility.js";

export class HomePage {

  private utility: Utility;
  private onClose: () => void;

  constructor(util: Utility) {
    this.utility = util;
  }

  public setCloseFunc(fn: () => void) {
    this.onClose = fn;
  }

  public run() {
    this.utility.renderAppHeader();
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
}