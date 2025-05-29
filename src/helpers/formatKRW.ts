/**
 * 원화를 반올림하고 천 단위로 콤마를 추가하여 포맷팅하는 함수
 * @param value - 포맷팅할 숫자
 * @returns 포맷팅된 원화 문자열
 */
export const formatKRW = (value: number | string | null): string => {
  // null이거나 undefined인 경우 빈 문자열 반환
  if (value === null || value === undefined) return '';
  
  // 문자열인 경우 숫자로 변환
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // 숫자가 아닌 경우 빈 문자열 반환
  if (isNaN(numValue)) return '';
  
  // 반올림하고 소수점 제거
  const roundedValue = Math.round(numValue);
  
  // 천 단위로 콤마 추가
  return roundedValue.toLocaleString('ko-KR');
}; 