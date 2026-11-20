export class Evaluator {
  constructor() { this.reset(); }
  reset() { this.active = false; this.target = null; this.correct = 0; this.attempts = 0; this.streak = 0; this.level = 1; this.total = 10; }
  start(level = 1, total = 10) { this.reset(); this.active = true; this.level = Number(level); this.total = Number(total); return this.next(); }
  next() { const max = this.level === 1 ? 20 : this.level === 2 ? 50 : 99; this.target = Math.floor(Math.random() * (max + 1)); return this.target; }
  answer(value) { if (!this.active || this.target === null) return { accepted: false }; this.attempts++; const correct = value === this.target; if (correct) { this.correct++; this.streak++; } else this.streak = 0; return { accepted: true, correct, score: this.correct * 10, finished: this.correct >= this.total }; }
  accuracy() { return this.attempts ? Math.round(this.correct / this.attempts * 100) : 0; }
}
