import inquirer from 'inquirer';
import { Utility } from "./Utility";

export class Page{
  constructor(private utility: Utility){};

  public showHomePage(){
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
        {value: 'exit', name: 'Exit program'},
      ],
    })
    .then((answers) => {
      if(answers.action === 'view_cards') {
        // this.cardsController.renderCardListingPage();
      }
      else{
        console.log('done');
      }
    });
  }

  public showCardListingPage(){}


}