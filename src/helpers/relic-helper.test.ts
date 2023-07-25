import { extractIdFromRelicName, getRelicNameById } from './relic-helper.js';

describe('Func extractIdFromRelicName', () => {
  test('Given valid parameter, it should return correct id', () => {
    expect(extractIdFromRelicName('[0] Hello World')).toBe(0);
    expect(extractIdFromRelicName('[99] Foo bar')).toBe(99);
  });
  test('Given invalid parameter, it should return -1', () => {
    expect(extractIdFromRelicName('[0 Hello World')).toBe(-1);
    expect(extractIdFromRelicName('99] Foo bar')).toBe(-1);
    expect(extractIdFromRelicName('asdf')).toBe(-1);
    expect(extractIdFromRelicName('[] Foo')).toBe(-1);
    expect(extractIdFromRelicName('[]')).toBe(-1);
    expect(extractIdFromRelicName('')).toBe(-1);
    expect(extractIdFromRelicName('99')).toBe(-1);
  });
});

describe('Func getRelicNameById', () => {
  const allRelics = [
    { title: '[16] Bronze Scales', identifier: 'Bronze Scales' },
    { title: '[17] Burning Blood', identifier: 'Burning Blood' },
    { title: '[18] Gold-Plated Cables', identifier: 'Cables' },
    { title: '[19] Calipers', identifier: 'Calipers' },
    { title: '[20] Calling Bell', identifier: 'Calling Bell' },
    { title: '[21] Cauldron', identifier: 'Cauldron' },
    { title: '[22] Centennial Puzzle', identifier: 'Centennial Puzzle' },
    { title: '[23] Champion Belt', identifier: 'Champion Belt' },
  ];
  test('Given valid parameter, it should return correct name', () => {
    expect(getRelicNameById(16, allRelics)).toBe('[16] Bronze Scales');
    expect(getRelicNameById(17, allRelics)).toBe('[17] Burning Blood');
  });
  test('Given invalid parameter, it should return empty string', () => {
    expect(getRelicNameById(-1, allRelics)).toBe('');
    expect(getRelicNameById(1000, allRelics)).toBe('');
  });
});
