/**
 * Fatness stages — the mom grows heavier (kg), which changes her emoji, makes
 * her bigger, and grants a compounding click-income bonus.
 *
 * Stage data (minKg / title / emoji) is config; scale and bonus are formulas
 * of the stage index.
 */

export const BONUS_PER_STAGE = 0.15;

export interface FatnessStage {
	stage: number;
	minKg: number;
	title: string;
	emoji: string;
}

export const FATNESS_STAGES: readonly [FatnessStage, ...FatnessStage[]] = [
	{ stage: 0, minKg: 0, title: "Regular mom", emoji: "🧓" },
	{ stage: 1, minKg: 10, title: "Well-fed", emoji: "👵" },
	{ stage: 2, minKg: 100, title: "Chunky", emoji: "🐷" },
	{ stage: 3, minKg: 250, title: "Hefty", emoji: "🐮" },
	{ stage: 4, minKg: 600, title: "Absolute unit", emoji: "🦛" },
	{ stage: 5, minKg: 2000, title: "Local legend", emoji: "🐘" },
	{ stage: 6, minKg: 6000, title: "Two seats on the bus", emoji: "🦣" },
	{ stage: 7, minKg: 20000, title: "The lift beeps", emoji: "🐋" },
	{ stage: 8, minKg: 100000, title: "Gravitational pull", emoji: "🌍" },
	{ stage: 9, minKg: 500000, title: "Own orbit", emoji: "🪐" },
	{ stage: 10, minKg: 10000000, title: "Maica-ta", emoji: "🍔" },
	{ stage: 11, minKg: 100000000, title: "Maica-ta", emoji: "🌌" },
];

/** Highest stage whose minKg ≤ kg (clamps to stage 0 for negative kg). */
export function getStage(kg: number): FatnessStage {
	let current: FatnessStage = FATNESS_STAGES[0];
	for (const stage of FATNESS_STAGES) {
		if (kg >= stage.minKg) current = stage;
	}
	return current;
}

/** How much the final stage's minKg grows to reach its end (1× → 2× scale). */
const LAST_STAGE_GROWTH = 2;

/** The final fatness stage (a non-empty list is always safe to index). */
export const LAST_STAGE: FatnessStage =
	FATNESS_STAGES[FATNESS_STAGES.length - 1] ?? FATNESS_STAGES[0];

/**
 * The kg at which a stage is considered complete: the next stage's minKg, or,
 * for the final stage, its minKg scaled by `LAST_STAGE_GROWTH`.
 */
export function stageEndKg(stage: FatnessStage): number {
	const next = FATNESS_STAGES[stage.stage + 1];
	if (next !== undefined) return next.minKg;
	return stage.minKg * LAST_STAGE_GROWTH;
}

/** The kg threshold that completes the final stage (the prestige trigger). */
export const LAST_STAGE_END_KG: number = stageEndKg(LAST_STAGE);

/** True once `kg` has reached the end of the final stage. */
export function isLastStageComplete(kg: number): boolean {
	return kg >= LAST_STAGE_END_KG;
}

/** Compounding click-income multiplier for a stage: 1.15^stage. */
export function bonusMultiplier(stage: number): number {
	return (1 + BONUS_PER_STAGE) ** stage;
}

/**
 * Emoji size multiplier. Grows 1× → 2× as `kg` progresses through the current
 * stage, resetting back to 1× when the next stage begins. The final stage
 * grows 1× → 2× up to `LAST_STAGE_END_KG`.
 */
export function scaleFactor(kg: number): number {
	const stage = getStage(kg);
	const end = stageEndKg(stage);
	const span = end - stage.minKg;
	if (span <= 0) return 1;
	const progress = Math.min(Math.max((kg - stage.minKg) / span, 0), 1);
	return 1 + progress;
}
