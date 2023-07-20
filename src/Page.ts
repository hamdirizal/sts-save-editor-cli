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
  }

  /** Showing the homepage */
  public render_home(){
    this.utility.renderAppHeader();
    inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        {value: 'view_cards', name: 'View cards'},
        {value: 'view_relics', name: 'View relics'},
        {value: 'manage_presets', name: 'Manage presets'},
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
      else if(answers.action === 'manage_presets') {
        this.showPresetListingPage();
      }
      else{
        this.render_exit();
      }
    });
  }

  private renderCardAsGrid(cards: CardWithTitle[]) {
    const colWidth = 24;
    this.utility.renderArrayAsGrid(
      cards.map(c=>`[${c.id}] ${c.identifier}`.substring(0, colWidth - 2)), colWidth, 5
    );
  }

  /** Show the card listing page */
  private render_cardListing(){
    this.utility.renderAppHeader();
    const cards: CardWithTitle[] = this.cardService.getCardList();
    const colWidth = 24;
    this.renderCardAsGrid(cards);
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
      message: presets.length ? 'Select a preset to view' : 'You don\'t have any preset',
      choices: options,
    })
    .then((answers) => {
      if(answers.action === 'back') {
        this.render_home();
      }
      else if(answers.action === 'create_new_preset') {
        this.showCreatePresetNameInput();
      }
      else{
        this.screen__viewSinglePreset(parseInt(answers.action));
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
        {value: 'cancel', name: 'Cancel. Back to the preset list page'},
      ],
    })
    .then((answers) => {
      if(answers.action === 'confirm') {
        this.presetService.writeDefaultPresetToDisk(generatedName);
        this.showPresetListingPage();
      }
      else if(answers.action === 'change_name') {
        this.showCreatePresetNameInput();
      }
      else {
        this.showPresetListingPage();
      }
    });
  }

  private showCreatePresetNameInput() {
    this.utility.renderAppHeader();
    inquirer
    .prompt({
      type: 'input',
      name: 'action',
      message: "Enter the preset name: ",
    })
    .then((answers) => {
      if(!(answers.action.trim())) {
        this.showCreatePresetNameInput();
      }
      else{
        this.render_confirmPresetName(answers.action)
      }
    });
  }


  /** 
   * Add array of card ids to a preset 
   */
  private addCardsToPreset(cardIds: number[] | string, presetId: number) {    
    let idsToBeAdded: number[];
    if(typeof cardIds === 'string') {
      idsToBeAdded = cardIds.trim().split(' ').filter((item) => {
        return parseInt(item) >= 0;
      }).map(item=>parseInt(item));
    }
    else{
      idsToBeAdded = cardIds;
    }
    
    const cards: CardWithTitle[] = this.cardService.getCardList();
    const obj = this.presetService.pushCardIdsToPreset(idsToBeAdded, presetId, cards);    
    this.presetService.writePresetToDisk(presetId, obj);
  }

  private screen__addCardsToPreset(presetId: number) {
    this.utility.renderAppHeader();
    const presetName = this.presetService.getPresetNameById(presetId);
    const presetObj = this.presetService.getPresetDataByFilename(presetName);
    const cards: CardWithTitle[] = this.cardService.getCardList();
    console.log('Available cards:');
    this.renderCardAsGrid(cards);
    inquirer
    .prompt({
      type: 'input',
      name: 'action',
      message: `Enter card IDs to be added to the "${presetName}", separated by spaces`,
    })
    .then((answers) => {
      this.addCardsToPreset(answers.action, presetId);
      this.screen__viewSinglePreset(presetId);
    });
  }

  private screen__viewSinglePreset(presetId: number) {
    this.utility.renderAppHeader();
    const presetName = this.presetService.getPresetNameById(presetId);
    const presetObj = this.presetService.getPresetDataByFilename(presetName);
    console.info(`Name:`, presetName);
    console.info(`Gold:`, presetObj.gold);
    console.info(`Cards:`, presetObj.cards);
    console.info(`Relics:`, presetObj.relics);
    inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'Action:',
      choices: [
        {value: 'add_cards', name: 'Add cards'},
        {value: 'remove_cards', name: 'Remove cards'},
        {value: 'add_relics', name: 'Add relics'},
        {value: 'remove_relics', name: 'Remove relics'},
        {value: 'set_gold', name: 'Set gold amount'},
        {value: 'delete_preset', name: 'Delete this preset'},
        {value: 'inject_savefile', name: 'Inject this preset to a save file'},
        {value: 'back', name: 'Back to the preset list page'},
      ],
    })
    .then((answers) => {
      if(answers.action === 'delete_preset') {
        this.showDeletePresetConfirmation(presetId);
      }
      else if(answers.action === 'add_cards') {
        this.screen__addCardsToPreset(presetId);
      }
      else{
        this.showPresetListingPage()
      }
    });
  }

  private showDeletePresetConfirmation(presetId: number) {
    this.utility.renderAppHeader();
    const presetName = this.presetService.getPresetNameById(presetId);
    inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: `Are you sure you want to permanently delete the preset "${presetName}"?`,
      choices: [
        {value: 'cancel', name: 'Cancel'},
        {value: 'confirm', name: 'Yes. Delete it'},
      ],
    })
    .then((answers) => {
      if(answers.action === 'confirm') {
        this.presetService.deletePresetFromDisk(presetName);
        this.showPresetListingPage();
      }
      else {
        this.screen__viewSinglePreset(presetId);
      }
    });
  }


}