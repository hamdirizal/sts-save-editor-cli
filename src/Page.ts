import inquirer from 'inquirer';
import { Utility } from './Utility.js';
import { CardService } from './services/CardService.js';
import { CardWithTitle, InquirerListOption, Preset, RelicWithTitle } from './types.js';
import { RelicService } from './services/RelicService.js';
import { PresetService } from './services/PresetService.js';
import { Translation } from './Translation.js';
import { APP_TITLE, APP_VERSION } from './constants.js';
import { EncoderService } from './services/EncoderService.js';

export class Page {
  constructor(
    private trans: Translation,
    private utility: Utility,
    private cardService: CardService,
    private relicService: RelicService,
    private presetService: PresetService,
    private encoderService: EncoderService
  ) {}

  private saveFilePath: string = '';

  private render_exit() {
    console.clear();
  }

  public renderAppHeader() {
    console.clear();
    const title = ` ${APP_TITLE} v.${APP_VERSION} `;
    const totalLength = 120;
    const beforeLength = Math.floor((totalLength - title.length) / 2);
    const afterLength = totalLength - (title.length + beforeLength);
    console.info(`${'='.repeat(beforeLength)}${title}${'='.repeat(afterLength)}`);
  }

  private renderCardsAsGrid(cards: CardWithTitle[]) {
    const colWidth = 24;
    const cardNames: string[] = cards.map((c) =>
      this.cardService.getDisplayNameById(c.id, cards).substring(0, colWidth - 2)
    );
    this.utility.renderArrayAsGrid(cardNames, colWidth, 5);
  }

  private renderRelicsAsGrid(relics: RelicWithTitle[]) {
    const colWidth = 30;
    const relicNames: string[] = relics.map((c) =>
      this.relicService.getDisplayNameById(c.id, relics).substring(0, colWidth - 2)
    );
    this.utility.renderArrayAsGrid(relicNames, colWidth, 4);
  }

  /**
   * Show the card listing page
   */
  private showScreen__cardList() {
    this.renderAppHeader();
    const cards: CardWithTitle[] = this.cardService.getCardList();
    const colWidth = 24;
    this.renderCardsAsGrid(cards);
    inquirer
      .prompt({
        type: 'input',
        name: 'action',
        message: this.trans.get('press_enter_back_to_main'),
      })
      .then(() => this.showScreen__home());
  }

  /**
   * Show the relic listing page
   */
  private showScreen__relicList() {
    this.renderAppHeader();
    const relics: RelicWithTitle[] = this.relicService.getRelicList();
    const colWidth = 30;
    this.renderRelicsAsGrid(relics);
    inquirer
      .prompt({
        type: 'input',
        name: 'action',
        message: this.trans.get('press_enter_back_to_main'),
      })
      .then(() => this.showScreen__home());
  }

  /** Show all available presets */
  public showPresetListingPage() {
    this.renderAppHeader();
    const presets: string[] = this.presetService.getAllPresets();
    const options: InquirerListOption[] = presets.map((p) => {
      return {
        value: p.split('.')[0],
        name: p,
      };
    });
    options.push({ value: 'create_new_preset', name: this.trans.get('create_new_preset') });
    options.push({ value: 'back', name: this.trans.get('back_to_main') });
    inquirer
      .prompt({
        type: 'list',
        name: 'action',
        message: presets.length ? 'Select a preset to view' : "You don't have any preset",
        choices: options,
      })
      .then((answers) => {
        if (answers.action === 'back') {
          this.showScreen__home();
        } else if (answers.action === 'create_new_preset') {
          this.showCreatePresetNameInput();
        } else {
          this.showScreen__viewSinglePreset(parseInt(answers.action));
        }
      });
  }
  private render_confirmPresetName(rawName: string) {
    this.renderAppHeader();
    const generatedName = this.presetService.generatePresetName(rawName);
    inquirer
      .prompt({
        type: 'list',
        name: 'action',
        message: `You are going to create a preset called "${generatedName}", are you sure?`,
        choices: [
          { value: 'confirm', name: 'Yes. Create the preset' },
          { value: 'change_name', name: 'No. Change name' },
          { value: 'cancel', name: 'Cancel. Back to the preset list page' },
        ],
      })
      .then((answers) => {
        if (answers.action === 'confirm') {
          this.presetService.writeDefaultPresetToDisk(generatedName);
          this.showPresetListingPage();
        } else if (answers.action === 'change_name') {
          this.showCreatePresetNameInput();
        } else {
          this.showPresetListingPage();
        }
      });
  }

  private showCreatePresetNameInput() {
    this.renderAppHeader();
    inquirer
      .prompt({
        type: 'input',
        name: 'action',
        message: 'Enter the preset name: ',
      })
      .then((answers) => {
        if (!answers.action.trim()) {
          this.showCreatePresetNameInput();
        } else {
          this.render_confirmPresetName(answers.action);
        }
      });
  }

  /**
   * Screen for setting gold amount to a preset
   */
  private showScreen__setGoldToPreset(presetId: number) {
    this.renderAppHeader();
    const presetName = this.presetService.getPresetNameById(presetId);
    const presetObj = this.presetService.getPresetDataByFilename(presetName);
    console.info(`Current amount: ${presetObj.gold} gold`);
    inquirer
      .prompt({
        type: 'input',
        name: 'action',
        message: `Enter gold amount to be set to the "${presetName}"`,
      })
      .then((answers) => {
        const amount = parseInt(answers.action);

        if (isNaN(amount)) {
          this.showScreen__setGoldToPreset(presetId);
          return;
        } else {
          const newPresetObj: Preset = { ...presetObj, gold: amount };
          this.presetService.writePresetToDisk(presetName, newPresetObj);
          this.showScreen__viewSinglePreset(presetId);
          return;
        }
      });
  }

  /**
   * Screen for removing cards from a preset
   */
  private showScreen__removeCardsFromPreset(presetId: number) {
    this.renderAppHeader();
    const presetName = this.presetService.getPresetNameById(presetId);
    const presetObj = this.presetService.getPresetDataByFilename(presetName);
    const cards: CardWithTitle[] = this.cardService.getCardList();
    console.info('Cards in this preset');
    console.info(this.cardService.transformIdsToReadableNames(presetObj.cards).join('  '));
    inquirer
      .prompt({
        type: 'input',
        name: 'action',
        message: `Enter card IDs to be removed. Separate by spaces:`,
      })
      .then((answers) => {
        const selectedCardIds = answers.action
          .trim()
          .split(' ')
          .filter((item) => {
            return parseInt(item) >= 0;
          })
          .map((item) => parseInt(item));
        const newPresetObj = this.presetService.removeCardsFromPreset(selectedCardIds, presetId);
        this.presetService.writePresetToDisk(presetName, newPresetObj);
        this.showScreen__viewSinglePreset(presetId);
      });
  }

  /**
   * Screen for adding cards to a preset
   */
  private showScreen__addCardsToPreset(presetId: number) {
    this.renderAppHeader();
    const presetName = this.presetService.getPresetNameById(presetId);
    const presetObj = this.presetService.getPresetDataByFilename(presetName);
    const cards: CardWithTitle[] = this.cardService.getCardList();
    console.info('Available cards:');
    this.renderCardsAsGrid(cards);
    inquirer
      .prompt({
        type: 'input',
        name: 'action',
        message: `Enter card IDs to be added, separate by spaces:`,
      })
      .then((answers) => {
        let idsToBeAdded: number[] = answers.action
          .trim()
          .split(' ')
          .filter((item) => {
            return parseInt(item) >= 0;
          })
          .map((item) => parseInt(item));
        const cards: CardWithTitle[] = this.cardService.getCardList();
        const newPresetObj: Preset = this.presetService.pushCardIdsToPreset(
          idsToBeAdded,
          presetId,
          cards
        );
        const presetName: string = this.presetService.getPresetNameById(presetId);
        this.presetService.writePresetToDisk(presetName, newPresetObj);

        this.showScreen__viewSinglePreset(presetId);
      });
  }

  private showScreen__addRelicsToPreset(presetId: number) {
    this.renderAppHeader();
    const presetName = this.presetService.getPresetNameById(presetId);
    const presetObj = this.presetService.getPresetDataByFilename(presetName);
    const relics: RelicWithTitle[] = this.relicService.getRelicList();
    console.info('Available relics:');
    this.renderRelicsAsGrid(relics);
    inquirer
      .prompt({
        type: 'input',
        name: 'action',
        message: `Enter relic IDs to be added. Separate by spaces:`,
      })
      .then((answers) => {
        let idsToBeAdded: number[] = answers.action
          .trim()
          .split(' ')
          .filter((item) => {
            return parseInt(item) >= 0;
          })
          .map((item) => parseInt(item));
        const relics: RelicWithTitle[] = this.relicService.getRelicList();
        const newPresetObj: Preset = this.presetService.pushRelicIdsToPreset(
          idsToBeAdded,
          presetId,
          relics
        );
        const presetName: string = this.presetService.getPresetNameById(presetId);
        this.presetService.writePresetToDisk(presetName, newPresetObj);

        this.showScreen__viewSinglePreset(presetId);
      });
  }

  private showScreen__removeRelicsFromPreset(presetId: number) {
    this.renderAppHeader();
    const presetName = this.presetService.getPresetNameById(presetId);
    const presetObj = this.presetService.getPresetDataByFilename(presetName);
    const relics: RelicWithTitle[] = this.relicService.getRelicList();
    console.info('Relics in this preset');
    console.info(this.relicService.transformIdsToReadableNames(presetObj.relics).join('  '));
    inquirer
      .prompt({
        type: 'input',
        name: 'action',
        message: `Enter relic IDs to be removed. Separate by spaces:`,
      })
      .then((answers) => {
        const selectedRelicIds = answers.action
          .trim()
          .split(' ')
          .filter((item) => {
            return parseInt(item) >= 0;
          })
          .map((item) => parseInt(item));
        const newPresetObj = this.presetService.removeRelicsFromPreset(selectedRelicIds, presetId);
        this.presetService.writePresetToDisk(presetName, newPresetObj);
        this.showScreen__viewSinglePreset(presetId);
      });
  }

  private showScreen__inputSaveFilePath(presetId: number, errorMessage: string | null) {
    this.renderAppHeader();
    if(errorMessage) {
      console.error(errorMessage);
    }
    inquirer
      .prompt({
        type: 'input',
        name: 'action',
        message: 'Enter the path to the save file',
        default: this.saveFilePath,
      })
      .then((answers) => {
        this.saveFilePath = answers.action;
        const isFileExists = this.encoderService.isSaveFileExists(answers.action);
        if (!isFileExists) {
          this.showScreen__inputSaveFilePath(presetId, 'Save file not found. Check the path again.');
          return;
        } 
        const saveDataObject = this.encoderService.readSaveDataFromDisk(answers.action);
        if (!saveDataObject) {
          this.showScreen__inputSaveFilePath(presetId, 'Invalid save file.');
          return;
        }
        if(!saveDataObject?.name){
          this.showScreen__inputSaveFilePath(presetId, 'Broken save file.');
          return;
        }
        console.log(saveDataObject);
      });
  }

  /**
   * Screen for viewing a single preset
   */
  private showScreen__viewSinglePreset(presetId: number) {
    this.renderAppHeader();
    const presetName = this.presetService.getPresetNameById(presetId);
    const presetObj = this.presetService.getPresetDataByFilename(presetName);
    console.info(`Name:`, presetName);
    console.info(`Gold:`, presetObj.gold);
    console.info(
      `Cards:`,
      this.cardService.transformIdsToReadableNames(presetObj.cards).join('  ')
    );
    console.info(
      `Relics:`,
      this.relicService.transformIdsToReadableNames(presetObj.relics).join('  ')
    );
    inquirer
      .prompt({
        type: 'list',
        name: 'action',
        message: 'Action:',
        choices: [
          { value: 'add_cards', name: '1) Add cards' },
          { value: 'remove_cards', name: '2) Remove cards' },
          { value: 'add_relics', name: '3) Add relics' },
          { value: 'remove_relics', name: '4) Remove relics' },
          { value: 'set_gold', name: '5) Set gold amount' },
          { value: 'delete_preset', name: '6) Delete this preset' },
          { value: 'inject_savefile', name: '7) Inject this preset to a save file' },
          { value: 'back', name: '8) Back to the preset list page' },
        ],
      })
      .then((answers) => {
        if (answers.action === 'delete_preset') {
          this.showScreen__deletePresetConfirmation(presetId);
        } else if (answers.action === 'add_cards') {
          this.showScreen__addCardsToPreset(presetId);
        } else if (answers.action === 'remove_cards') {
          this.showScreen__removeCardsFromPreset(presetId);
        } else if (answers.action === 'add_relics') {
          this.showScreen__addRelicsToPreset(presetId);
        } else if (answers.action === 'remove_relics') {
          this.showScreen__removeRelicsFromPreset(presetId);
        } else if (answers.action === 'set_gold') {
          this.showScreen__setGoldToPreset(presetId);
        } else if (answers.action === 'inject_savefile') {
          this.showScreen__inputSaveFilePath(presetId, null);
        } else {
          this.showPresetListingPage();
        }
      });
  }

  private showScreen__deletePresetConfirmation(presetId: number) {
    this.renderAppHeader();
    const presetName = this.presetService.getPresetNameById(presetId);
    inquirer
      .prompt({
        type: 'list',
        name: 'action',
        message: `Are you sure you want to permanently delete the preset "${presetName}"?`,
        choices: [
          { value: 'cancel', name: 'Cancel' },
          { value: 'confirm', name: 'Yes. Delete it' },
        ],
      })
      .then((answers) => {
        if (answers.action === 'confirm') {
          this.presetService.deletePresetFromDisk(presetName);
          this.showPresetListingPage();
        } else {
          this.showScreen__viewSinglePreset(presetId);
        }
      });
  }

  /** Showing the homepage */
  public showScreen__home() {
    this.renderAppHeader();
    inquirer
      .prompt({
        type: 'list',
        name: 'action',
        message: 'What do you want to do?',
        choices: [
          { value: 'view_cards', name: '1) View cards' },
          { value: 'view_relics', name: '2) View relics' },
          { value: 'manage_presets', name: '3) Manage presets' },
          { value: 'exit', name: '4) Exit' },
        ],
      })
      .then((answers) => {
        if (answers.action === 'view_cards') {
          this.showScreen__cardList();
        } else if (answers.action === 'view_relics') {
          this.showScreen__relicList();
        } else if (answers.action === 'manage_presets') {
          this.showPresetListingPage();
        } else {
          this.render_exit();
        }
      });
  }
}
