import inquirer from 'inquirer';
import { Utility } from "./Utility";
import { CardService } from './CardService';
import { Card } from './types';

export class Page{
  constructor(
    private utility: Utility,
    private cardService: CardService
    ){};

  /** Showing the homepage */
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
        this.showCardListingPage();
      }
      else{
        console.log('done');
      }
    });
  }

  /** Show the card listing page */
  public showCardListingPage(){
    this.utility.renderAppHeader();
    const cards: Card[] = this.cardService.getCardList();
    const colWidth = 24;
    this.utility.renderArrayAsGrid(
      cards.map(c=>`[${c.id}] ${c.identifier}`.substring(0, colWidth - 2)), colWidth, 5
    );
    inquirer
    .prompt({
      type: 'input',
      name: 'action',
      message: 'Press [Enter] to go back to the main page',
    })
    .then(() => this.showHomePage());
  }


}