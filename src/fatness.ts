/**
 * Fatness stages — the mom grows heavier (kg), which changes her emoji, makes
 * her bigger, and grants a compounding click-income bonus.
 *
 * Stage data (minKg / title / emoji) is config; scale and bonus are formulas
 * of the stage index.
 */

export const BONUS_PER_STAGE = 0.15;
export const SCALE_PER_STAGE = 0.06;

export interface FatnessStage {
  stage: number;
  minKg: number;
  title: string;
  emoji: string;
}

export const FATNESS_STAGES: readonly [FatnessStage, ...FatnessStage[]] = [
  { stage: 0, minKg: 0, title: 'Regular mom', emoji: '🧓' },
  { stage: 1, minKg: 10, title: 'Well-fed', emoji: '👵' },
  { stage: 2, minKg: 50, title: 'Chunky', emoji: '🐷' },
  { stage: 3, minKg: 150, title: 'Hefty', emoji: '🐮' },
  { stage: 4, minKg: 400, title: 'Absolute unit', emoji: '🦛' },
  { stage: 5, minKg: 1000, title: 'Local legend', emoji: '🐘' },
  { stage: 6, minKg: 2500, title: 'Two seats on the bus', emoji: '🦣' },
  { stage: 7, minKg: 6000, title: 'The lift beeps', emoji: '🐋' },
  { stage: 8, minKg: 15000, title: 'Gravitational pull', emoji: '🌍' },
  { stage: 9, minKg: 40000, title: 'Own orbit', emoji: '🪐' },
];

/** Highest stage whose minKg ≤ kg (clamps to stage 0 for negative kg). */
export function getStage(kg: number): FatnessStage {
  let current: FatnessStage = FATNESS_STAGES[0];
  for (const stage of FATNESS_STAGES) {
    if (kg >= stage.minKg) current = stage;
  }
  return current;
}

/** Compounding click-income multiplier for a stage: 1.15^stage. */
export function bonusMultiplier(stage: number): number {
  return (1 + BONUS_PER_STAGE) ** stage;
}

/** Emoji size multiplier for a stage: 1 + 0.06 × stage. */
export function scaleFactor(stage: number): number {
  return 1 + SCALE_PER_STAGE * stage;
}
