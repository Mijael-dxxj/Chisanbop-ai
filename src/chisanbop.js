export const FINGER_NAMES = ['pulgar', 'índice', 'medio', 'anular', 'meñique'];

export function handValue(fingers = []) {
  const normalized = Array.isArray(fingers) ? fingers : [];
  return Math.min(9, (normalized[0] ? 5 : 0) + normalized.slice(1, 5).filter(Boolean).length);
}

export function calculateNumber(leftFingers, rightFingers) {
  const tens = handValue(leftFingers) * 10;
  const units = handValue(rightFingers);
  return { tens, units, value: tens + units };
}

export function fingersForValue(value) {
  const safe = Math.max(0, Math.min(9, Math.floor(value)));
  return [safe >= 5, ...Array.from({ length: 4 }, (_, i) => safe - (safe >= 5 ? 5 : 0) > i)];
}
