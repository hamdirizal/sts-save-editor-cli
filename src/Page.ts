import inquirer from 'inquirer';
import { Utility } from "./Utility.js";
import { CardService } from './CardService.js';
import { CardWithTitle, InquirerListOption, RelicWithTitle } from './types.js';
import { RelicService } from './RelicService.js';
import { PresetService } from './services/PresetService.js';
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
        this.render_cardListing();
      }
      else if(answers.action === 'view_relics') {
        this.render_relicListing();
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
  private render_cardListing(){
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
      message: this.trans.get('press_enter_back_to_main'),
    })
    .then(() => this.showHomePage());
  }

  /** Show the relic listing page */
  private render_relicListing(){
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
      message: this.trans.get('press_enter_back_to_main'),
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
    options.push({value: "create_new_preset", name: this.trans.get('create_new_preset')});
    options.push({value: "back", name: this.trans.get('back_to_main')});
    inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'Select a preset to view ',
      choices: options,
    })
    .then((answers) => {
      if(answers.action === 'back') {
        this.showHomePage();
      }
      else if(answers.action === 'create_new_preset') {
        this.render_createPresetForm();
      }
      else{
        this.showSinglePreset(parseInt(answers.action));
      }
    });
  }
  private render_confirmPresetName(rawName: string) {
    this.utility.renderAppHeader();
    const generatedName = this.presetService.generatePresetName(rawName);
    inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: `You are going to create a preset called ${generatedName}, are you sure?`,
      choices: [
        {value: 'confirm', name: 'Yes. Create the preset'},
        {value: 'change_name', name: 'No. Change name'},
        {value: 'cancel', name: 'Cancel. Go back to the presets page'},
      ],
    })
    .then((answers) => {
      if(answers.action === 'confirm') {
        this.showPresetListingPage();
      }
      else if(answers.action === 'change_name') {
        this.render_createPresetForm();
      }
      else {
        this.showPresetListingPage();
      }
    });
  }

  private render_createPresetForm() {
    this.utility.renderAppHeader();
    inquirer
    .prompt({
      type: 'input',
      name: 'preset_name',
      message: "Enter the preset name: ",
    })
    .then((answers) => this.render_confirmPresetName(answers.preset_name));
  }

  public showSinglePreset(presetId: number) {
    this.utility.renderAppHeader();
    console.log(this.presetService.getSinglePresetById(presetId));
    inquirer
    .prompt({
      type: 'input',
      name: 'action',
      message: this.trans.get('press_enter_to_go_back'),
    })
    .then(() => this.showPresetListingPage());
  }


}