import inquirer from 'inquirer';
import SearchBox from 'inquirer-search-list';
import { Utility } from './Utility.js';
import { CardService } from './services/CardService.js';
import { CardWithTitle, InquirerListOption, Preset, RelicWithTitle, SaveObject } from './types.js';
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
      .then(() => this.showScreen__home(null));
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

  /** Show all available presets */
  public showScreen__managePresets(errorMessage: string | null) {
    this.renderAppHeader();
    const presets: string[] = this.presetService.getAllPresets();
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
    console.info(
      `You are going to create a preset called "${this.presetService.renderNiceName(
        generatedName
      )}", are you sure?`
    );
    console.info('    1) Yes, create it');
    console.info('    2) No, change the name');
    console.info('    3) Cancel. Back to the preset list page');
    inquirer
      .prompt({
        type: 'input',
        name: 'action',
        message: 'Action: ',
      })
      .then((answers) => {
        if (parseInt(answers.action) === 1) {
          this.presetService.writeDefaultPresetToDisk(generatedName);
          this.showScreen__managePresets(null);
        } else if (parseInt(answers.action) === 2) {
          this.showScreen__presetNameInput();
        } else if (parseInt(answers.action) === 3) {
          this.showScreen__managePresets(null);
        } else {
          this.showScreen__confirmPresetName('', null);
        }
      });
  }

  private showScreen__presetNameInput() {
    this.renderAppHeader();
    inquirer
      .prompt({
        type: 'input',
        name: 'action',
        message: 'Enter the preset name: ',
      })
      .then((answers) => {
        // Try to create name
        const generatedName = this.presetService.generatePresetName(answers.action);
        if (!generatedName) {
          this.showScreen__presetNameInput();
          return;
        } else {
          this.showScreen__confirmPresetName(generatedName, null);
          return;
        }
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

  private showScreen__inputSaveFilePath(presetFilename: string, errorMessage: string | null) {
    this.renderAppHeader();
    if (errorMessage) {
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
          this.showScreen__inputSaveFilePath(
            presetFilename,
            'Save file not found. Check the path again.'
          );
          return;
        }
        const saveDataObject = this.encoderService.readSaveDataFromDisk(answers.action);
        if (!saveDataObject) {
          this.showScreen__inputSaveFilePath(presetFilename, 'Invalid save file.');
          return;
        }
        if (!saveDataObject?.name) {
          this.showScreen__inputSaveFilePath(presetFilename, 'Broken save file.');
          return;
        }

        this.injectPresetToSaveFile(presetFilename, saveDataObject);
      });
  }

  private injectPresetToSaveFile(presetFilename: string, saveDataObject: SaveObject) {
    console.info('Injecting...');
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

    console.info('Done.');
  }

  /**
   * Screen for viewing a single preset
   */
  private showScreen__viewSinglePreset(presetFilename: string) {
    this.renderAppHeader();
    const presetObj = this.presetService.getPresetDataByFilename(presetFilename);
    console.info(`Name:`, this.presetService.renderNiceName(presetFilename));
    console.info(`Gold:`, presetObj.gold);
    console.info(
      `Cards:`,
      this.cardService.transformIdsToReadableNames(presetObj.cards).join('  ')
    );
    console.info(
      `Relics:`,
      this.relicService.transformIdsToReadableNames(presetObj.relics).join('  ')
    );
    console.info('What do you want to do? ');
    console.info('    1) Add cards');
    console.info('    2) Remove cards');
    console.info('    3) Add relics');
    console.info('    4) Remove relics');
    console.info('    5) Set gold amount');
    console.info('    6) Delete this preset');
    console.info('    7) Inject this preset to a save file');
    console.info('    8) Back to the preset list page');

    inquirer
      .prompt({
        type: 'input',
        name: 'action',
        message: 'Action: ',
      })
      .then((answers) => {
        if (parseInt(answers.action) === 6) {
          this.showScreen__deletePresetConfirmation(presetFilename);
        } else if (parseInt(answers.action) === 1) {
          this.showScreen__addCardsToPreset(presetFilename);
        } else if (parseInt(answers.action) === 2) {
          this.showScreen__removeCardsFromPreset(presetFilename);
        } else if (parseInt(answers.action) === 3) {
          this.showScreen__addRelicsToPreset(presetFilename);
        } else if (parseInt(answers.action) === 4) {
          this.showScreen__removeRelicsFromPreset(presetFilename);
        } else if (parseInt(answers.action) === 5) {
          this.showScreen__setGoldToPreset(presetFilename);
        } else if (parseInt(answers.action) === 7) {
          this.showScreen__inputSaveFilePath(presetFilename, null);
        } else {
          this.showScreen__managePresets(null);
        }
      });
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
    var history = ['John', 'Jack', 'Joey', 'Billy', 'Bob'];

    var autoComplete = [
      'Barack Obama',
      'George W. Bush',
      'Bill Clinton',
      'George Bush',
      'Ronald W. Reagan',
      'Jimmy Carter',
      'Gerald Ford',
      'Richard Nixon',
      'Lyndon Johnson',
      'John F. Kennedy',
      'Dwight Eisenhower',
      'Harry Truman',
      'Franklin Roosevelt',
    ];

    term('Please enter your name: ');

    term.inputField(
      { history: history, autoComplete: autoComplete, autoCompleteMenu: true },
      function (error, input) {
        term.green("\nYour name is '%s'\n", input);
        process.exit();
      }
    );

    // const cards: CardWithTitle[] = this.cardService.getCardList();
    // if (errorMessage) console.error(errorMessage);
    // console.info(`What do you want to do?:
    // 1) View cards
    // 2) View relics
    // 3) Manage presets
    // 0) Exit`);
    // inquirer
    //   .prompt([
    //     {
    //       type: 'search-list',
    //       message: 'Select topping',
    //       name: 'topping',
    //       choices: cards.map((c) => c.title),
    //       validate: function (answer) {
    //         if (answer === 'Bottle') {
    //           return `Whoops, ${answer} is not a real topping.`;
    //         }
    //         return true;
    //       },
    //     },
    //   ])
    //   .then(function (answers) {
    //     console.log(JSON.stringify(answers, null, '  '));
    //   })
    //   .catch((e) => console.log(e));
    // inquirer
    //   .prompt({
    //     type: 'input',
    //     name: 'action',
    //     message: 'Action: ',
    //   })
    //   .then((answers) => {
    //     if (parseInt(answers.action) === 1) {
    //       this.showScreen__cardList();
    //       return;
    //     } else if (parseInt(answers.action) === 2) {
    //       this.showScreen__relicList();
    //       return;
    //     } else if (parseInt(answers.action) === 3) {
    //       this.showScreen__managePresets(null);
    //       return;
    //     } else if (parseInt(answers.action) === 0) {
    //       this.showScreen__exit();
    //     } else {
    //       this.showScreen__home(`"${answers.action}" is invalid input.`);
    //       return;
    //     }
    //   });
  }
}
