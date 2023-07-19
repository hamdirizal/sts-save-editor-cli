import relics from "./relics.json" assert { type: "json" };
import { displayAsGrid } from "./utils.js";

export const getRelicList = () => {
  // Convert to array
  const keys = Object.keys(relics);
  const arr = [];
  keys.forEach(key => {
    arr.push({
      identifier: key,
      title: relics[key].NAME
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

export const renderRelicList = () => {
  console.info(`
AVAILABLE RELICS
  `)
  displayAsGrid(getRelicList().map(r=>`${r.id}. ${r.title}`), 30, 3);
}