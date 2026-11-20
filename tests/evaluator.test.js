import { describe, expect, it } from 'vitest';
import { Evaluator, CHALLENGE_STATES } from '../src/evaluator.js';

describe('modo desafío automático', () => {
  it('genera diez objetivos sin repetir y respeta el nivel', () => {
    const evaluator = new Evaluator();
    evaluator.start(2, 10, 15);
    expect(evaluator.sequence).toHaveLength(10);
    expect(new Set(evaluator.sequence).size).toBe(10);
    expect(evaluator.sequence.every(value => value >= 0 && value <= 50)).toBe(true);
  });

  it('valida una respuesta una sola vez y avanza tras la transición', () => {
    const evaluator = new Evaluator(); evaluator.start(1, 10, 15);
    const target = evaluator.target;
    expect(evaluator.answer(target).correct).toBe(true);
    expect(evaluator.answer(target).accepted).toBe(false);
    expect(evaluator.state).toBe(CHALLENGE_STATES.CORRECT);
    expect(evaluator.prepareTransition()).toBe(true);
    expect(evaluator.advance().state).toBe(CHALLENGE_STATES.WAITING);
    expect(evaluator.correct).toBe(1);
  });

  it('agota el tiempo y pausa sin consumir segundos', () => {
    const evaluator = new Evaluator(); evaluator.start(3, 10, 15);
    evaluator.tick(5000); evaluator.pause(); evaluator.tick(10000);
    expect(evaluator.remainingMs).toBe(10000);
    evaluator.resume(); expect(evaluator.tick(10000).type).toBe('timeout');
    expect(evaluator.state).toBe(CHALLENGE_STATES.TIMEOUT);
  });

  it('finaliza exactamente después de diez ejercicios', () => {
    const evaluator = new Evaluator(); evaluator.start(1, 10, 15);
    for (let i = 0; i < 10; i++) { evaluator.answer(evaluator.target); evaluator.prepareTransition(); evaluator.advance(); }
    expect(evaluator.state).toBe(CHALLENGE_STATES.FINISHED);
    expect(evaluator.correct).toBe(10);
    expect(evaluator.accuracy()).toBe(100);
  });
});
