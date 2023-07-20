import inquirer from 'inquirer';
import { Utility } from "./Utility";
import { CardService } from './CardService';
import { CardWithTitle, RelicWithTitle } from './types';
import { RelicService } from './RelicService';
import { PresetService } from './PresetService';

export class Page{
  constructor(
    private utility: Utility,
    private cardService: CardService,
    private relicService: RelicService,
    private presetService: PresetService
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
        {value: 'exit', name: 'Exit'},
      ],
    })
    .then((answers) => {
      if(answers.action === 'view_cards') {
        this.showCardListingPage();
      }
      else if(answers.action === 'view_relics') {
        this.showRelicListingPage();
      }
      else{
        console.log('done');
      }
    });
  }

  /** Show the card listing page */
  public showCardListingPage(){
    this.utility.renderAppHeader();
    const cards: CardWithTitle[] = this.cardService.getCardList();
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

  /** Show the relic listing page */
  public showRelicListingPage(){
    this.utility.renderAppHeader();
    const relics: RelicWithTitle[] = this.relicService.getRelicList();
    const colWidth = 30;
    this.utility.renderArrayAsGrid(
      relics.map(c=>`[${c.id}] ${c.identifier}`.substring(0, colWidth - 2)), colWidth, 4
    );
    inquirer
    .prompt({
      type: 'input',
      name: 'action',
      message: 'Press [Enter] to go back to the main page',
    })
    .then(() => this.showHomePage());
  }

  /** Show all available presets */
  public showPresetListingPage() {    
    this.utility.renderAppHeader();
  }


}