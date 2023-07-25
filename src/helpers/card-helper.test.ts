import { extractIdFromCardName, getCardNameById } from './card-helper.js';

describe('Func extractIdFromCardName', () => {
  test('Given valid parameter, it should return correct id', () => {
    expect(extractIdFromCardName('[0] Hello World')).toBe(0);
    expect(extractIdFromCardName('[99] Foo bar')).toBe(99);
  });
  test('Given invalid parameter, it should return -1', () => {
    expect(extractIdFromCardName('[0 Hello World')).toBe(-1);
    expect(extractIdFromCardName('99] Foo bar')).toBe(-1);
    expect(extractIdFromCardName('asdf')).toBe(-1);
    expect(extractIdFromCardName('[] Foo')).toBe(-1);
    expect(extractIdFromCardName('[]')).toBe(-1);
    expect(extractIdFromCardName('')).toBe(-1);
    expect(extractIdFromCardName('99')).toBe(-1);
  });
});

describe('Func getCardNameById', () => {
  const allCards = [
    { title: '[1] A Thousand Cuts', identifier: 'A Thousand Cuts' },
    { title: '[2] Accuracy', identifier: 'Accuracy' },
    { title: '[3] Acrobatics', identifier: 'Acrobatics' },
    { title: '[4] Adrenaline', identifier: 'Adrenaline' },
    { title: '[5] After Image', identifier: 'After Image' },
    { title: '[6] Aggregate', identifier: 'Aggregate' },
    { title: '[7] All for One', identifier: 'All For One' },
    { title: '[8] All-Out Attack', identifier: 'All Out Attack' },
    { title: '[9] Allocate', identifier: 'Allocate' },
    { title: '[10] Amplify', identifier: 'Amplify' },
  ];
  test('Given valid parameter, it should return correct name', () => {
    expect(getCardNameById(1, allCards)).toBe('[1] A Thousand Cuts');
    expect(getCardNameById(10, allCards)).toBe('[10] Amplify');
  });
  test('Given invalid parameter, it should return empty string', () => {
    expect(getCardNameById(-1, allCards)).toBe('');
    expect(getCardNameById(1000, allCards)).toBe('');
  });
});
