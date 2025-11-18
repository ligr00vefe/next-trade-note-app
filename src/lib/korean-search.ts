// 한국어 자음 검색 유틸리티 함수
// 초성(자음)으로도 검색할 수 있도록 구현

// 한글 자음과 모음 매핑
const CHOSEONG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

const JUNGSEONG = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
];

const JONGSEONG = [
  '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

// 한글 음절을 초성, 중성, 종성으로 분리하는 함수
function decomposeHangul(char: string): { choseong: string; jungseong: string; jongseong: string } | null {
  const code = char.charCodeAt(0) - 0xAC00;

  if (code < 0 || code > 11171) {
    return null; // 한글이 아님
  }

  const jongseongIndex = code % 28;
  const jungseongIndex = ((code - jongseongIndex) / 28) % 21;
  const choseongIndex = Math.floor((code - jongseongIndex) / 28 / 21);

  return {
    choseong: CHOSEONG[choseongIndex] || '',
    jungseong: JUNGSEONG[jungseongIndex] || '',
    jongseong: JONGSEONG[jongseongIndex] || ''
  };
}

// 검색어에서 초성만 추출하는 함수
function extractChoseong(text: string): string {
  return text
    .split('')
    .map(char => {
      const decomposed = decomposeHangul(char);
      return decomposed ? decomposed.choseong : char;
    })
    .join('');
}

// 검색어로 필터링하는 함수
export function searchByKoreanConsonant(items: Array<{ shortName: string }>, searchTerm: string): Array<{ shortName: string }> {
  if (!searchTerm.trim()) {
    return items;
  }

  const searchChoseong = extractChoseong(searchTerm.toLowerCase());

  return items.filter(item => {
    const itemChoseong = extractChoseong(item.shortName.toLowerCase());

    // 완전 일치 검색도 함께 수행 (자음 검색 + 완전 검색)
    return (
      item.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itemChoseong.includes(searchChoseong)
    );
  });
}

// 초성 검색만 수행하는 함수 (자음만으로 검색)
export function searchByChoseongOnly(items: Array<{ shortName: string }>, searchTerm: string): Array<{ shortName: string }> {
  if (!searchTerm.trim()) {
    return items;
  }

  const searchChoseong = extractChoseong(searchTerm.toLowerCase());

  return items.filter(item => {
    const itemChoseong = extractChoseong(item.shortName.toLowerCase());
    return itemChoseong.includes(searchChoseong);
  });
}
