import { languages, getLanguageNameFromCode } from './languages';

describe('languages', () => {
  it('contains nb, nn, en', () => {
    expect(languages.some(l => l.code === 'nb')).toBe(true);
    expect(languages.some(l => l.code === 'nn')).toBe(true);
    expect(languages.some(l => l.code === 'en')).toBe(true);
  });
});

describe('getLanguageNameFromCode', () => {
  it('returns name for known code', () => {
    expect(getLanguageNameFromCode('nb')).toBe('Norwegian Bokmål');
    expect(getLanguageNameFromCode('nn')).toBe('Norwegian Nynorsk');
    expect(getLanguageNameFromCode('en')).toBe('English');
  });
  it('returns code for unknown code', () => {
    expect(getLanguageNameFromCode('fr')).toBe('fr');
  });
});
