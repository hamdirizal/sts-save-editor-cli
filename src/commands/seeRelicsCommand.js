import { RELICS } from "../relics.js";

let str = `AVAILABLE RELICS
`;
const colWidth = 30;

export const seeRelicsCommand = () => {
  RELICS.forEach((relic) => {
    const itemStr = `${relic.id}. ${relic.name}`;
    let spacer = '';
    if(itemStr.length < colWidth){
      const spaceRepeatCount = colWidth - itemStr.length;
      spacer = ' '.repeat(spaceRepeatCount);
    }
    str += `${itemStr}${spacer}`;
  });
  console.info(str)
}