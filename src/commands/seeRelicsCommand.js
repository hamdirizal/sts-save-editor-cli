import { displayAsGrid, getRelicList } from "../utils.js";

export const seeRelicsCommand = () => {
  console.info(`
AVAILABLE RELICS
  `)
  displayAsGrid(getRelicList().map(r=>`${r.id}. ${r.name}`), 30, 3);
}