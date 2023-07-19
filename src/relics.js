'use strict';

import { displayAsGrid } from "./utils.js";
import fs from 'fs';

export const getRelicList = () => {
  let rawdata = fs.readFileSync('./src/relics.json');
  let relics = JSON.parse(rawdata);

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
  displayAsGrid(getRelicList().map(r=>`${r.id}. ${r.title}`), 30, 4);
}