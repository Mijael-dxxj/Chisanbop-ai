import { describe, expect, it } from 'vitest';
import { calculateNumber, fingersForValue, handValue } from '../src/chisanbop.js';
import { analyzeFingers } from '../src/fingerAnalyzer.js';

function landmarksForThumb(thumbPoints) {
  const points = Array.from({ length: 21 }, () => ({ x: 0, y: 0, z: 0 }));
  points[0] = { x: 0.5, y: 0.8, z: 0 };
  points[5] = { x: 0.35, y: 0.55, z: 0 }; points[9] = { x: 0.5, y: 0.45, z: 0 }; points[17] = { x: 0.65, y: 0.55, z: 0 };
  points[1] = thumbPoints[0]; points[2] = thumbPoints[1]; points[3] = thumbPoints[2]; points[4] = thumbPoints[3];
  return points;
}

const extendedRight = landmarksForThumb([{ x: .47, y: .68 }, { x: .38, y: .68 }, { x: .28, y: .64 }, { x: .18, y: .58 }]);
const extendedDiagonal = landmarksForThumb([{ x: .47, y: .68 }, { x: .40, y: .62 }, { x: .34, y: .52 }, { x: .30, y: .42 }]);
const flexed = landmarksForThumb([{ x: .47, y: .68 }, { x: .49, y: .66 }, { x: .52, y: .64 }, { x: .55, y: .62 }]);

describe('reglas Chisanbop', () => {
  it.each([[0,0,0],[0,1,1],[0,5,5],[1,0,10],[1,5,15],[5,9,59],[9,9,99]])('calcula %i y %i como %i', (left, right, expected) => expect(calculateNumber(fingersForValue(left), fingersForValue(right)).value).toBe(expected));
  it('convierte combinaciones de pulgar', () => { expect(handValue([false,true,true,true,true])).toBe(4); expect(handValue([true])).toBe(5); expect(handValue([true,true])).toBe(6); expect(handValue([true,true,true])).toBe(7); expect(handValue([true,true,true,true])).toBe(8); expect(handValue([true,true,true,true,true])).toBe(9); });
});

describe('detección geométrica del pulgar', () => {
  it.each([['derecha', 'Right'], ['izquierda', 'Left']])('reconoce pulgar lateral en mano %s', (_, hand) => expect(analyzeFingers(extendedRight, hand)[0]).toBe(true));
  it('reconoce un pulgar diagonal', () => expect(analyzeFingers(extendedDiagonal, 'Right')[0]).toBe(true));
  it('mantiene flexionado un pulgar doblado', () => expect(analyzeFingers(flexed, 'Right')[0]).toBe(false));
  it('conserva los valores 5, 6, 50 y 60', () => {
    expect(calculateNumber([true], [false]).value).toBe(50);
    expect(calculateNumber([true, true], [false]).value).toBe(60);
    expect(calculateNumber([false], [true]).value).toBe(5);
    expect(calculateNumber([false], [true, true]).value).toBe(6);
  });
});
