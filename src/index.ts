import { Utility } from './Utility.js';
import { CardService } from './services/CardService.js';
import { Page } from './Page.js';
import { RelicService } from './services/RelicService.js';
import { PresetService } from './services/PresetService.js';
import { Translation } from './Translation.js';
import { EncoderService } from './services/EncoderService.js';

const utility: Utility = new Utility();
const translation: Translation = new Translation('en');
const cardService: CardService = new CardService();
const relicService: RelicService = new RelicService();
const presetService: PresetService = new PresetService();
const encoderService: EncoderService = new EncoderService();

const page: Page = new Page(translation, utility, cardService, relicService, presetService, encoderService);

page.showScreen__home();

// const processTheGivenSavePath = (savePath) => {
//   if(existsSync(savePath)) {
//     const appState:AppState = readAppState();
//     writeAppState({
//       ...appState,
//       gameSavePath: savePath
//     });
//     console.log('Directory exists')
//   }
//   else {
//     console.log('Directory does not exist');
//   }

// }

// const noSavePath = () => {
//   inquirer
//     .prompt({
//       type: 'input',
//       name: 'save_path',
//       message: 'Please enter the path where the save file exists',
//     })
//     .then((answers) => {
//       processTheGivenSavePath(answers.save_path);
//     });
// }

// const noSaveFile = () => {
//   inquirer
//     .prompt({
//       type: 'input',
//       name: 'save_path',
//       message: 'Please enter the path where the save file exists',
//     })
//     .then(() => {
//       console.log('The wolf mauls you. You die. The end.');
//     });
// }

// const success = () => {}

// const homePagex = () => {
//   renderAppHeader();
//   inquirer
//     .prompt({
//       type: 'list',
//       name: 'action',
//       message: 'What do you want to do?',
//       choices: [
//         {value: 'view_cards', name: 'View all cards'},
//         {value: 'view_relics', name: 'View all relics'},
//         {value: 'presets', name: 'View presets'},
//         {value: 'inject_save_file', name: 'Inject preset to a save file'},
//         {value: 'exit', name: 'Exit'},
//       ],
//     })
//     .then((answers) => {
//       if(answers.action === 'view_cards') {
//         // viewCardsPage(homePage());
//       }
//       else{
//         console.log('done');
//       }
//     });
// }

// main();
