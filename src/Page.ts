import inquirer from 'inquirer';
import SearchBox from 'inquirer-search-list';
import { Utility } from './Utility.js';
import { CardService } from './services/CardService.js';
import {
  CardWithTitle,
  InquirerListOption,
  ListOption,
  Preset,
  RelicWithTitle,
  SaveObject,
} from './types.js';
import { RelicService } from './services/RelicService.js';
import { PresetService } from './services/PresetService.js';
import { Translation } from './Translation.js';
import { APP_TITLE, APP_VERSION } from './constants.js';
import { EncoderService } from './services/EncoderService.js';
import tk from 'terminal-kit';
const term = tk.terminal;

inquirer.registerPrompt('search-list', SearchBox);

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

  private showScreen__exit() {
    console.clear();
    process.exit();
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
    term.cyan('Press ENTER to go back to the main page...');

    term.inputField({ autoCompleteMenu: false }, (error, input) => {
      this.showScreen__home(null);
    });
    // inquirer
    //   .prompt({
    //     type: 'input',
    //     name: 'action',
    //     message: this.trans.get('press_enter_back_to_main'),
    //   })
    //   .then(() => this.showScreen__home(null));
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
      .then(() => this.showScreen__home(null));
  }

  public showScreen__presetSelection() {
    this.renderAppHeader();
    const allPresets: string[] = this.presetService.getAllPresets();
    const colWidth = 30;
    console.info('All presets:');
    term(
      this.utility.renderArrayAsGrid(
        allPresets.map((p) => p.substring(0, colWidth - 2)),
        colWidth,
        3
      )
    );
    console.info('');

    term.cyan(
      'Please type preset name to be opened. Press <TAB> to autocomplete. Press <ESC> to go back.\n'
    );
    term.inputField(
      {
        autoComplete: (input) => this.utility.searchArray(input, allPresets),
        autoCompleteMenu: true,
        autoCompleteHint: false,
        cancelable: true,
      },
      (error, input) => {
        // If input is falsy, reload the screen
        if (!input || !input.trim()) {
          this.showScreen__managePresets(null);
          return;
        }
        // If input is truthy, but the preset not on the list, reload the screen
        if (allPresets.indexOf(input) === -1) {
          this.showScreen__presetSelection();
          return;
        }
        // At this point, the process is valid, go to the preset details page
        this.showScreen__presetDetailsPage(input);
      }
    );
  }

  /** Show all available presets */
  public showScreen__managePresets(errorMessage: string | null) {
    this.renderAppHeader();
    const presets: string[] = this.presetService.getAllPresets();

    term.cyan('What do you want to do?\n');

    const choices: ListOption[] = [];
    if (presets.length) choices.push({ name: 'Open preset', value: 'open_preset' });
    choices.push({ name: 'Create new preset', value: 'create_preset' });
    choices.push({ name: 'Back to the main page', value: 'back' });

    term.singleColumnMenu(
      choices.map((o) => o.name),
      { cancelable: true },
      (error, response) => {
        if (response?.canceled) {
          this.showScreen__home(null);
          return;
        }
        const obj = choices[response.selectedIndex];
        if (obj.value === 'open_preset') {
          this.showScreen__presetSelection();
        } else if (obj.value === 'create_preset') {
          this.showScreen__presetNameInput();
        } else {
          this.showScreen__home(null);
        }
      }
    );

    return;
    const indexedPresets = presets.map((p, i) => {
      return {
        index: i + 3,
        name: p,
      };
    });
    if (errorMessage) console.error(errorMessage);
    const presetText = presets.length
      ? 'Open preset:'
      : "You don't have any preset, please create a new one.";
    console.info(`What do you want to do?:
    1) Back to the main page
    2) Create a new preset
    ${presetText}`);
    console.info(
      indexedPresets
        .map((p) => `    ${p.index}) ${this.presetService.renderNiceName(p.name)}`)
        .join('\n')
    );
    inquirer
      .prompt({
        type: 'input',
        name: 'action',
        message: 'Action: ',
      })
      .then((answers) => {
        if (parseInt(answers.action) === 1) {
          this.showScreen__home(null);
        } else if (parseInt(answers.action) === 2) {
          this.showScreen__presetNameInput();
        } else {
          // Open preset in the list
          const selectedPreset = indexedPresets.find((p) => p.index === parseInt(answers.action));
          if (selectedPreset) {
            const presetName = selectedPreset?.name;
            this.showScreen__viewSinglePreset(presetName);
          } else {
            this.showScreen__managePresets('Invalid input.');
          }
        }
      });
  }

  private showScreen__confirmPresetName(generatedName: string, errorMessage: string | null) {
    this.renderAppHeader();
    term.cyan('You are going to create a preset called ');
    term.yellow(generatedName);
    term.cyan(' are you sure?\n');

    var choices = [
      'Yes, create the preset ',
      'No, change name ',
      'Cancel, Back to the preset list ',
    ];

    term.singleColumnMenu(choices, { cancelable: true }, (error, response) => {
      if (response?.canceled) {
        this.showScreen__managePresets(null);
        return;
      }
      if (response.selectedIndex === 0) {
        this.presetService.writeDefaultPresetToDisk(generatedName);
        this.showScreen__managePresets(null);
        return;
      } else if (response.selectedIndex === 1) {
        this.showScreen__presetNameInput();
        return;
      } else {
        this.showScreen__managePresets(null);
        return;
      }
    });
  }

  private showScreen__presetNameInput() {
    this.renderAppHeader();
    term.cyan('Enter a name for the new preset: ');
    term.inputField({ autoCompleteMenu: false, cancelable: true }, (error, input) => {
      //If cancelled, return to the preset management page
      if (input === undefined) {
        this.showScreen__managePresets(null);
        return;
      }
      // If input is empty, loop back to this page
      if (!input.trim()) {
        this.showScreen__presetNameInput();
        return;
      }
      const generatedName = this.presetService.generatePresetName(input);
      if (!generatedName) {
        this.showScreen__presetNameInput();
        return;
      }
      // Otherwise, go to the name confirmation page
      this.showScreen__confirmPresetName(generatedName, null);
      return;
    });
  }

  /**
   * Screen for setting gold amount to a preset
   */
  private showScreen__setGoldToPreset(presetFilename: string) {
    this.renderAppHeader();
    const presetObj = this.presetService.getPresetDataByFilename(presetFilename);
    console.info(`Current amount: ${presetObj.gold} gold`);
    inquirer
      .prompt({
        type: 'input',
        name: 'action',
        message: `Enter gold amount to be set to the "${this.presetService.renderNiceName(
          presetFilename
        )}"`,
      })
      .then((answers) => {
        const amount = parseInt(answers.action);

        if (isNaN(amount)) {
          this.showScreen__setGoldToPreset(presetFilename);
          return;
        } else {
          const newPresetObj: Preset = { ...presetObj, gold: amount };
          this.presetService.writePresetToDisk(presetFilename, newPresetObj);
          this.showScreen__viewSinglePreset(presetFilename);
          return;
        }
      });
  }

  /**
   * Screen for removing cards from a preset
   */
  private showScreen__removeCardsFromPreset(presetFilename: string) {
    this.renderAppHeader();
    const presetObj = this.presetService.getPresetDataByFilename(presetFilename);
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
        const newPresetObj = this.presetService.removeCardsFromPreset(
          selectedCardIds,
          presetFilename
        );
        this.presetService.writePresetToDisk(presetFilename, newPresetObj);
        this.showScreen__viewSinglePreset(presetFilename);
      });
  }

  /**
   * Screen for adding cards to a preset
   */
  private showScreen__addCardsToPreset(presetFilename: string) {
    this.renderAppHeader();
    const presetObj = this.presetService.getPresetDataByFilename(presetFilename);
    const cards: CardWithTitle[] = this.cardService.getCardList();
    term.cyan(`Cards in this ${presetFilename} preset (${presetObj.cards.length}): \n`);
    term(presetObj.cards.map((c) => `-- ${c}`).join('  '));
    term('\n\n');
    term.cyan('Please type card name to be added. <TAB> to autocomplete. <ENTER> to confirm \n');
    term.inputField(
      {
        autoComplete: (input) =>
          this.utility.searchArray(
            input,
            cards.map((c) => c.title)
          ),
        autoCompleteMenu: true,
        autoCompleteHint: false,
        cancelable: true,
      },
      (error, input) => {
        return;
        // If input is falsy, reload the screen
        // if (!input || !input.trim()) {
        //   this.showScreen__managePresets(null);
        //   return;
        // }
        // // If input is truthy, but the preset not on the list, reload the screen
        // if (cards.indexOf(input) === -1) {
        //   this.showScreen__presetSelection();
        //   return;
        // }
        // // At this point, the process is valid, go to the preset details page
        // this.showScreen__presetDetailsPage(input);
      }
    );

    //=============hamdi
    return;
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
          presetFilename,
          cards
        );
        this.presetService.writePresetToDisk(presetFilename, newPresetObj);

        this.showScreen__viewSinglePreset(presetFilename);
      });
  }

  private showScreen__addRelicsToPreset(presetFilename: string) {
    this.renderAppHeader();
    const presetObj = this.presetService.getPresetDataByFilename(presetFilename);
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
          presetFilename,
          relics
        );
        this.presetService.writePresetToDisk(presetFilename, newPresetObj);

        this.showScreen__viewSinglePreset(presetFilename);
      });
  }

  private showScreen__removeRelicsFromPreset(presetFilename: string) {
    this.renderAppHeader();
    const presetObj = this.presetService.getPresetDataByFilename(presetFilename);
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
        const newPresetObj = this.presetService.removeRelicsFromPreset(
          selectedRelicIds,
          presetFilename
        );
        this.presetService.writePresetToDisk(presetFilename, newPresetObj);
        this.showScreen__viewSinglePreset(presetFilename);
      });
  }

  private showScreen__injectionComplete(presetFilename: string) {
    term.cyan(presetFilename);
    term.cyan(' preset has been injected to the savefile\n\n');
    term.cyan('Press <ENTER> or <ESC> to go back to the preset page');
    term.inputField({ autoCompleteMenu: false }, (error, input) => {
      this.showScreen__presetDetailsPage(presetFilename);
    });
  }

  private showScreen__inputSaveFilePath(presetFilename: string, errorMessage: string | null) {
    this.renderAppHeader();
    term.cyan('Enter the path to the save file: ');
    term.inputField({ autoCompleteMenu: false }, (error, input) => {
      this.saveFilePath = input;
      const isFileExists = this.encoderService.isSaveFileExists(input);
      if (!isFileExists) {
        this.showScreen__inputSaveFilePath(
          presetFilename,
          'Save file not found. Check the path again.'
        );
        return;
      }
      const saveDataObject = this.encoderService.readSaveDataFromDisk(input);
      if (!saveDataObject) {
        this.showScreen__inputSaveFilePath(presetFilename, 'Invalid save file.');
        return;
      }
      if (!saveDataObject?.name) {
        this.showScreen__inputSaveFilePath(presetFilename, 'Broken save file.');
        return;
      }

      this.injectPresetToSaveFile(presetFilename, saveDataObject);

      // Show injection success message
      this.showScreen__injectionComplete(presetFilename);
    });
  }

  private injectPresetToSaveFile(presetFilename: string, saveDataObject: SaveObject) {
    const presetObj = this.presetService.getPresetDataByFilename(presetFilename);
    const cards = this.cardService.getCardList();
    const relics = this.relicService.getRelicList();

    const newSaveObject = this.encoderService.getInjectedSaveObject(
      presetObj,
      saveDataObject,
      cards,
      relics
    );

    this.encoderService.writeSaveDataToDisk(this.saveFilePath, newSaveObject);
  }

  /**
   * Screen for viewing a single preset
   */
  private showScreen__viewSinglePreset(presetFilename: string) {
    this.renderAppHeader();
    const presetObj = this.presetService.getPresetDataByFilename(presetFilename);
    term.cyan('Preset name: ');
    term(presetFilename + '\n');
    term.cyan('Gold: ');
    term(presetObj.gold + '\n');
    term.cyan('Cards: \n');
    term(this.cardService.transformIdsToReadableNames(presetObj.cards).join('  ') + '\n');
    term.cyan('Relics: \n');
    term(this.relicService.transformIdsToReadableNames(presetObj.relics).join('  ') + '\n\n');
    term.cyan('What do you want to do with this preset?');

    const choices: ListOption[] = [
      { name: 'Inject this preset to a save file', value: 'inject_preset' },
      { name: 'Add cards', value: 'add_cards' },
      { name: 'Remove cards', value: 'remove_cards' },
      { name: 'Add relics', value: 'add_relics' },
      { name: 'Remove relics', value: 'remove_relics' },
      { name: 'Set gold amount', value: 'set_gold' },
      { name: 'Delete this preset', value: 'delete_preset' },
      { name: 'Back to the preset list', value: 'back' },
    ];

    term.singleColumnMenu(
      choices.map((o) => o.name),
      { cancelable: true },
      (error, response) => {
        if (response?.canceled) {
          this.showScreen__managePresets(null);
          return;
        }
        const obj = choices[response.selectedIndex];
        if (obj.value === 'inject_preset') {
          this.showScreen__inputSaveFilePath(presetFilename, null);
        } else if (obj.value === 'add_cards') {
          this.showScreen__addCardsToPreset(presetFilename);
        } else if (obj.value === 'create_preset') {
          // this.showScreen__presetNameInput();
        } else {
          this.showScreen__managePresets(null);
        }
      }
    );

    // inquirer
    //   .prompt({
    //     type: 'input',
    //     name: 'action',
    //     message: 'Action: ',
    //   })
    //   .then((answers) => {
    //     if (parseInt(answers.action) === 6) {
    //       this.showScreen__deletePresetConfirmation(presetFilename);
    //     } else if (parseInt(answers.action) === 1) {
    //       this.showScreen__addCardsToPreset(presetFilename);
    //     } else if (parseInt(answers.action) === 2) {
    //       this.showScreen__removeCardsFromPreset(presetFilename);
    //     } else if (parseInt(answers.action) === 3) {
    //       this.showScreen__addRelicsToPreset(presetFilename);
    //     } else if (parseInt(answers.action) === 4) {
    //       this.showScreen__removeRelicsFromPreset(presetFilename);
    //     } else if (parseInt(answers.action) === 5) {
    //       this.showScreen__setGoldToPreset(presetFilename);
    //     } else if (parseInt(answers.action) === 7) {
    //       this.showScreen__inputSaveFilePath(presetFilename, null);
    //     } else {
    //       this.showScreen__managePresets(null);
    //     }
    //   });
  }

  public showScreen__presetDetailsPage(presetFilename: string) {
    this.showScreen__viewSinglePreset(presetFilename);
  }

  private showScreen__deletePresetConfirmation(presetFilename) {
    this.renderAppHeader();
    inquirer
      .prompt({
        type: 'list',
        name: 'action',
        message: `Are you sure you want to permanently delete the preset "${this.presetService.renderNiceName(
          presetFilename
        )}"?`,
        choices: [
          { value: 'cancel', name: 'Cancel' },
          { value: 'confirm', name: 'Yes. Delete it' },
        ],
      })
      .then((answers) => {
        if (answers.action === 'confirm') {
          this.presetService.deletePresetFromDisk(presetFilename);
          this.showScreen__managePresets(null);
        } else {
          this.showScreen__viewSinglePreset(presetFilename);
        }
      });
  }

  /** Showing the homepage */
  public showScreen__home(errorMessage: string | null) {
    this.renderAppHeader();

    term.cyan('What do you want to do?\n');

    var items = ['Manage presets ', 'View cards ', 'View relics ', 'Exit '];

    term.singleColumnMenu(items, { cancelable: true }, (error, response) => {
      if (response?.canceled) {
        this.showScreen__exit();
        return;
      }
      if (response.selectedIndex === 0) {
        this.showScreen__managePresets(null);
      } else if (response.selectedIndex === 1) {
        this.showScreen__cardList();
      } else if (response.selectedIndex === 2) {
        this.showScreen__relicList();
      } else {
        this.showScreen__exit();
      }
    });
  }
}
