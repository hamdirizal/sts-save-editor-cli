import { extractIdFromCardName } from "./card-helper.js";

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
