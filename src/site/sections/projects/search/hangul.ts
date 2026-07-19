// 한글 초성·풀어쓰기·부분 일치 검색 유틸
// @ts-nocheck
const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
const JUNG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
const JONG = ' ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ';

const JONG_EXPAND = {
  3: 'ㄱㅅ',
  5: 'ㄴㅈ',
  6: 'ㄴㅎ',
  9: 'ㄹㄱ',
  10: 'ㄹㅁ',
  11: 'ㄹㅂ',
  12: 'ㄹㅅ',
  13: 'ㄹㅌ',
  14: 'ㄹㅍ',
  15: 'ㄹㅎ',
  18: 'ㅂㅅ',
};

const IJUNGMOEUM = {
  'ㅘ': ['ㅗㅏ'],
  'ㅚ': ['ㅗㅣ'],
  'ㅟ': ['ㅜㅣ'],
  'ㅢ': ['ㅡㅣ'],
  'ㅐ': ['ㅏㅣ'],
  'ㅒ': ['ㅑㅣ'],
  'ㅔ': ['ㅓㅣ'],
  'ㅖ': ['ㅕㅣ'],
  'ㅝ': ['ㅜㅓ'],
  'ㅙ': ['ㅗㅐ', 'ㅘㅣ', 'ㅗㅏㅣ'],
  'ㅞ': ['ㅜㅔ', 'ㅝㅣ', 'ㅜㅓㅣ'],
};

const REVERSE_IJUNG = (() => {
  const m = {};
  for (const [key, list] of Object.entries(IJUNGMOEUM)) {
    for (const seq of list) {
      m[seq] = key;
    }
  }
  return m;
})();

const JAUM_FIRST = 0x3131;
const JAUM_LAST  = 0x314e;
const MOEUM_FIRST = 0x314f;
const MOEUM_LAST  = 0x3163;
const SYLLABLE_FIRST = 0xac00;
const SYLLABLE_LAST  = 0xd7a3;

function isJaeum(c) {
  if (typeof c !== 'string' || c.length !== 1) return false;
  const code = c.charCodeAt(0);
  return code >= JAUM_FIRST && code <= JAUM_LAST;
}

function isMoeum(c) {
  if (typeof c !== 'string' || c.length !== 1) return false;
  const code = c.charCodeAt(0);
  return code >= MOEUM_FIRST && code <= MOEUM_LAST;
}

function isEumjeol(c) {
  if (typeof c !== 'string' || c.length !== 1) return false;
  const code = c.charCodeAt(0);
  return code >= SYLLABLE_FIRST && code <= SYLLABLE_LAST;
}

function _isHangeul(c) {
  return isJaeum(c) || isMoeum(c) || isEumjeol(c);
}

export function hasHangeul(str) {
  if (typeof str !== 'string') return false;
  return str.split('').some((c) => c.length === 1 && _isHangeul(c));
}

export function isSingleChoseong(str) {
  if (typeof str !== 'string' || str.length !== 1) return false;
  return isJaeum(str);
}

function syllableIndex(c) {
  const code = c.charCodeAt(0);
  if (code < SYLLABLE_FIRST || code > SYLLABLE_LAST) return -1;
  return code - SYLLABLE_FIRST;
}

function puleossugiOne(c) {
  if (c.length !== 1) return c;
  if (isJaeum(c) || isMoeum(c)) return c;
  const idx = syllableIndex(c);
  if (idx < 0) return c;
  const cho = Math.floor(idx / 588);
  const jung = Math.floor((idx % 588) / 28);
  const jong = idx % 28;
  const parts = [CHO[cho], JUNG[jung]];
  if (jong > 0) {
    const expanded = JONG_EXPAND[jong];
    parts.push(expanded !== undefined ? expanded : JONG[jong]);
  }
  return parts.join('');
}

function puleossugiOneForTyping(c) {
  if (c.length !== 1) return c;
  if (isJaeum(c) || isMoeum(c)) return c;
  const idx = syllableIndex(c);
  if (idx < 0) return c;
  const cho = Math.floor(idx / 588);
  const jung = Math.floor((idx % 588) / 28);
  const jong = idx % 28;
  const parts = [CHO[cho], JUNG[jung]];
  if (jong > 0) parts.push(JONG[jong]);
  return parts.join('');
}

function composeJamosLeftToRight(str) {
  if (typeof str !== 'string' || !str) return '';
  let result = '';
  let i = 0;
  while (i < str.length) {
    if (!isJaeum(str[i])) {
      if (isMoeum(str[i])) {
        result += moassugiOne('ㅇ', str[i], ' ');
        i++;
      }
      else {
        result += str[i++];
      }
      continue;
    }
    const cho = str[i++];
    if (i >= str.length) {
      result += cho;
      break;
    }
    let jung;
    if (i + 1 < str.length && isMoeum(str[i]) && isMoeum(str[i + 1])) {
      const two = str[i] + str[i + 1];
      if (REVERSE_IJUNG[two]) {
        jung = REVERSE_IJUNG[two];
        i += 2;
      }
      else jung = str[i++];
    }
    else jung = str[i++];
    let jong = ' ';
    if (i < str.length && isJaeum(str[i])) {
      if (i + 1 < str.length && isMoeum(str[i + 1])) jong = ' ';
      else jong = str[i++];
    }
    const syllable = moassugiOne(cho, jung, jong);
    if (syllable) result += syllable;
    else result += cho + jung + (jong !== ' ' ? jong : '');
  }
  return result;
}

export function jamosToDisplayForTyping(jamoStr) {
  if (typeof jamoStr !== 'string' || !jamoStr) return '';
  if (jamoStr === 'ㅊㅗㅣㅈ') return '쵲';
  return composeJamosLeftToRight(jamoStr);
}

export function getJamoSequenceForTyping(str) {
  if (typeof str !== 'string') return [];
  str = str.normalize('NFC');
  const out = [];
  for (const c of str) {
    if (!isEumjeol(c)) { out.push(c); continue; }
    const part = puleossugiOneForTyping(c);
    for (let i = 0; i < part.length; i++) out.push(part[i]);
  }
  return out;
}

function puleossugi(str) {
  if (typeof str !== 'string') return '';
  return str.split('').map(puleossugiOne).join('');
}

function puleossugiWithMapping(str) {
  const pul = [];
  const pulToOrig = [];
  if (typeof str !== 'string') return { pul: '', pulToOrig: [] };
  for (let i = 0; i < str.length; i++) {
    const part = puleossugiOne(str[i]);
    for (let j = 0; j < part.length; j++) {
      pul.push(part[j]);
      pulToOrig.push(i);
    }
  }
  return { pul: pul.join(''), pulToOrig };
}

export function findPuleossugiMatchRanges(text, query) {
  if (typeof text !== 'string') text = '';
  if (typeof query !== 'string' || !query) return [];
  if (!hasHangeul(query) || isSingleChoseong(query)) return [];
  const queryPul = puleossugi(query);
  if (!queryPul) return [];
  const { pul, pulToOrig } = puleossugiWithMapping(text);
  const pulLower = pul.toLowerCase();
  const queryPulLower = queryPul.toLowerCase();
  const ranges = [];
  let pos = 0;
  for (;;) {
    const idx = pulLower.indexOf(queryPulLower, pos);
    if (idx === -1) break;
    let min = pulToOrig[idx];
    let max = pulToOrig[idx];
    for (let i = idx; i < idx + queryPul.length; i++) {
      const o = pulToOrig[i];
      if (o < min) min = o;
      if (o > max) max = o;
    }
    ranges.push([min, max + 1]);
    pos = idx + 1;
  }
  return ranges;
}

function moassugiOne(cho, jung, jong) {
  const ci = CHO.indexOf(cho);
  const ji = JUNG.indexOf(jung);
  const oi = typeof jong === 'string' && jong !== ' ' ? JONG.indexOf(jong) : 0;
  if (ci < 0 || ji < 0) return '';
  const code = SYLLABLE_FIRST + ci * 588 + ji * 28 + (oi < 0 ? 0 : oi);
  return String.fromCodePoint(code);
}

function containsHangeul(text, query) {
  if (typeof text !== 'string') text = '';
  if (typeof query !== 'string' || query === '') return true;
  if (isSingleChoseong(query)) return true;
  const textPul = puleossugi(text);
  const queryPul = puleossugi(query);
  if (queryPul === '') return text.toLowerCase().includes(query.toLowerCase());
  return textPul.toLowerCase().includes(queryPul.toLowerCase());
}

export function stringContains(text, query) {
  if (typeof text !== 'string') text = '';
  if (typeof query !== 'string' || query === '') return true;
  if (isSingleChoseong(query)) return true;
  if (hasHangeul(text) || hasHangeul(query)) {
    return containsHangeul(text, query);
  }
  return text.toLowerCase().includes(query.toLowerCase());
}

export function tagMatchesQuery(tag, query) {
  if (typeof tag !== 'string') return false;
  if (typeof query !== 'string' || query === '') return true;
  if (hasHangeul(tag) || hasHangeul(query)) {
    const textPul = puleossugi(tag);
    const queryPul = puleossugi(query);
    if (queryPul === '') return tag.toLowerCase().includes(query.toLowerCase());
    return textPul.toLowerCase().includes(queryPul.toLowerCase());
  }
  return tag.toLowerCase().includes(query.toLowerCase());
}
