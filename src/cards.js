import { displayAsGrid } from "./utils.js";

const getCardList = () => {
  let rawdata = fs.readFileSync('./src/cards.json');
  let cards = JSON.parse(rawdata);

  // Convert to array
  const keys = Object.keys(cards);
  const arr = [];
  keys.forEach(key => {
    arr.push({
      identifier: key,
      title: cards[key].NAME
    });
  });

  // Sort by name
  const sorted = arr.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  });

  const result = sorted.map((item, index) => {
    return {
      id: index,
      title: item.title,
      identifier: item.identifier
    }
  })

  return result;
}

export const renderCardList = () => {
  console.info(`
AVAILABLE CARDS
  `)
  displayAsGrid(getCardList().map(r=>`${r.id}. ${r.identifier}`), 30, 4);
}