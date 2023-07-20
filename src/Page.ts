import inquirer from 'inquirer';
import { Utility } from "./Utility.js";
import { CardService } from './CardService.js';
import { CardWithTitle, InquirerListOption, RelicWithTitle } from './types.js';
import { RelicService } from './RelicService.js';
import { PresetService } from './services/PresetService.js';
import { Translation } from './Translation.js';
import { APP_TITLE, APP_VERSION } from './constants.js';

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

  private render_exit(){
    console.clear();
    console.info(`${APP_TITLE} v.${APP_VERSION} closed!`);
  }

  /** Showing the homepage */
  public render_home(){
    this.utility.renderAppHeader();
    inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'Navigate to:',
      choices: [
        {value: 'view_cards', name: 'Cards'},
        {value: 'view_relics', name: 'Relics'},
        {value: 'view_presets', name: 'Presets'},
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
        this.render_exit();
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
    .then(() => this.render_home());
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
    .then(() => this.render_home());
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
        this.render_home();
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
      message: `You are going to create a preset called "${generatedName}", are you sure?`,
      choices: [
        {value: 'confirm', name: 'Yes. Create the preset'},
        {value: 'change_name', name: 'No. Change name'},
        {value: 'cancel', name: 'Cancel. Go back to the presets page'},
      ],
    })
    .then((answers) => {
      if(answers.action === 'confirm') {
        this.presetService.writeDefaultPresetToDisk(generatedName);
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
      name: 'action',
      message: "Enter the preset name: ",
    })
    .then((answers) => {
      if(!(answers.action.trim())) {
        this.render_createPresetForm();
      }
      else{
        this.render_confirmPresetName(answers.action)
      }
    });
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