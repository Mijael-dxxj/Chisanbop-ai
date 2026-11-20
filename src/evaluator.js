export const CHALLENGE_STATES = Object.freeze({ WAITING: 'waiting', CORRECT: 'correct', TIMEOUT: 'timeout', TRANSITIONING: 'transitioning', FINISHED: 'finished' });

export class Evaluator {
  constructor() { this.reset(); }
  reset() { this.active = false; this.paused = false; this.level = 1; this.total = 10; this.timeLimit = 15; this.remainingMs = 15000; this.target = null; this.sequence = []; this.index = -1; this.correct = 0; this.attempts = 0; this.streak = 0; this.state = CHALLENGE_STATES.WAITING; this.elapsedMs = 0; }
  maxForLevel(level) { return Number(level) === 1 ? 20 : Number(level) === 2 ? 50 : 99; }
  generateSequence(level = this.level, total = this.total) { const pool = Array.from({ length: this.maxForLevel(level) + 1 }, (_, value) => value); for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; } return pool.slice(0, Math.min(total, pool.length)); }
  start(level = 1, total = 10, timeLimit = 15) { this.reset(); this.active = true; this.level = Number(level); this.total = Number(total); this.timeLimit = Number(timeLimit); this.sequence = this.generateSequence(this.level, this.total); this.index = 0; this.beginExercise(); return this.snapshot(); }
  beginExercise() { this.target = this.sequence[this.index]; this.remainingMs = this.timeLimit * 1000; this.state = CHALLENGE_STATES.WAITING; this.paused = false; }
  tick(milliseconds) { if (!this.active || this.paused || this.state !== CHALLENGE_STATES.WAITING) return null; this.remainingMs = Math.max(0, this.remainingMs - milliseconds); this.elapsedMs += milliseconds; if (this.remainingMs === 0) { this.state = CHALLENGE_STATES.TIMEOUT; return { type: 'timeout', ...this.snapshot() }; } return { type: 'tick', ...this.snapshot() }; }
  answer(value) { if (!this.active || this.paused || this.state !== CHALLENGE_STATES.WAITING) return { accepted: false }; this.attempts++; if (Number(value) !== this.target) return { ...this.snapshot(), accepted: true, correct: false }; this.correct++; this.streak++; this.state = CHALLENGE_STATES.CORRECT; return { ...this.snapshot(), accepted: true, correct: true, type: 'correct' }; }
  pause() { if (this.active && this.state === CHALLENGE_STATES.WAITING) this.paused = true; return this.snapshot(); }
  resume() { if (this.active && this.state === CHALLENGE_STATES.WAITING) this.paused = false; return this.snapshot(); }
  prepareTransition() { if (!this.active || ![CHALLENGE_STATES.CORRECT, CHALLENGE_STATES.TIMEOUT].includes(this.state)) return false; this.state = CHALLENGE_STATES.TRANSITIONING; return true; }
  advance() { if (!this.active || this.state !== CHALLENGE_STATES.TRANSITIONING) return this.snapshot(); this.index++; if (this.index >= this.sequence.length) { this.active = false; this.state = CHALLENGE_STATES.FINISHED; this.target = null; } else this.beginExercise(); return this.snapshot(); }
  abandon() { this.reset(); return this.snapshot(); }
  accuracy() { return this.total ? Math.round(this.correct / this.total * 100) : 0; }
  snapshot() { return { active: this.active, paused: this.paused, state: this.state, level: this.level, target: this.target, exercise: this.index + 1, total: this.total, correct: this.correct, attempts: this.attempts, score: this.correct * 10, accuracy: this.accuracy(), remainingSeconds: Math.ceil(this.remainingMs / 1000), elapsedMs: this.elapsedMs }; }
}
