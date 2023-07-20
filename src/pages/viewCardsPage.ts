import inquirer from 'inquirer';
import { getCardList } from "../cards.js";
import { Card } from "../types.js";
import { renderAppHeader, renderArrayAsGrid } from "../utils.js";

export const viewCardsPage = (onGoBack: ()=>void) => {
  renderAppHeader();
  console.info('All available cards');
  const cards: Card[] = getCardList();
  const colWidth = 24;
  console.info(renderArrayAsGrid(cards.map(c=>`[${c.id}] ${c.title}`.substring(0, colWidth-2)), colWidth, 5));
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'Back to main page?',
      choices: [
        {value: 'ok', name: 'OK'},
      ],
    })
    .then((answers) => {
      onGoBack();
    });
}