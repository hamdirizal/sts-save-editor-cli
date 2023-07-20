import inquirer from 'inquirer';
import { Utility } from "./Utility.js";
import { CardService } from './CardService.js';
import { CardWithTitle, InquirerListOption, RelicWithTitle } from './types.js';
import { RelicService } from './RelicService.js';
import { PresetService } from './services/PresetService.js';
import { TEXTCOLOR } from './constants.js';
import { Translation } from './Translation.js';

export class Page{

  private Actions = {
    VIEW_CARDS: 'view_cards',
    VIEW_RELICS: 'view_relics',
    VIEW_PRESETS: 'view_presets',
    INJECT_SAVE_FILE: 'inject_save_file',
    EXIT: 'exit',
  }

  constructor(
    private trans: Translation,
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
        {value: 'view_presets', name: 'View all presets'},
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
      else if(answers.action === 'view_presets') {
        this.showPresetListingPage();
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
      message: this.trans.get('press_enter_to_go_back'),
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
      message: this.trans.get('press_enter_to_go_back'),
    })
    .then(() => this.showHomePage());
  }

  /** Show all available presets */
  public showPresetListingPage() {    
    this.utility.renderAppHeader();
    const presets: string[] = this.presetService.getAllPresets();
    const options: InquirerListOption[] = presets.map((p) => {
      return {
        value: p.split('.')[0],
        name: p,
      }
    });
    options.push({value: "back", name: this.trans.get('go_back')});
    inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'Select a preset to view',
      choices: options,
    })
    .then((answers) => {
      if(answers.action === 'back') {
        this.showHomePage();
      }
      else{
        this.showSinglePreset(parseInt(answers.action));
      }
    });
  }

  public showSinglePreset(presetId: number) {
    inquirer
    .prompt({
      type: 'input',
      name: 'action',
      message: this.trans.get('press_enter_to_go_back'),
    })
    .then(() => this.showPresetListingPage());
  }


}